import Submission from "../models/Submission.js";
import Assessment from "../models/Assessment.js";
import User from "../models/User.js";
import { sendGradeReleasedEmail, sendSubmissionReceivedEmail } from "../services/emailService.js";

// ─── @GET /api/submissions ───
export const getAllSubmissions = async (req, res) => {
  const filter = {};

  if (req.user.role === "learner") filter.learner = req.user._id;

  const submissions = await Submission.find(filter)
    .populate("assessment", "title totalMarks passMark deadline")
    .populate("learner", "name email avatar")
    .populate("gradedBy", "name")
    .sort({ submittedAt: -1 });

  res.json({ success: true, count: submissions.length, submissions });
};

// ─── @GET /api/submissions/:id ───
export const getSubmissionById = async (req, res) => {
  const submission = await Submission.findById(req.params.id)
    .populate("assessment", "title questions totalMarks passMark")
    .populate("learner", "name email avatar")
    .populate("gradedBy", "name");

  if (!submission) {
    res.status(404);
    throw new Error("Submission not found.");
  }

  res.json({ success: true, submission });
};

// ─── @POST /api/submissions ─── (Learner submits)
export const createSubmission = async (req, res) => {
  const { assessmentId, answers } = req.body;

  if (!assessmentId || !answers?.length) {
    res.status(400);
    throw new Error("Assessment ID and answers are required.");
  }

  const assessment = await Assessment.findById(assessmentId).populate("createdBy");

  if (!assessment) {
    res.status(404);
    throw new Error("Assessment not found.");
  }

  // Check deadline
  if (new Date() > new Date(assessment.deadline)) {
    res.status(400);
    throw new Error("The deadline for this assessment has passed.");
  }

  // Check if already submitted
  const existing = await Submission.findOne({
    assessment: assessmentId,
    learner: req.user._id,
  });

  if (existing) {
    res.status(400);
    throw new Error("You have already submitted this assessment.");
  }

  const submission = await Submission.create({
    assessment: assessmentId,
    learner: req.user._id,
    answers,
  });

  // Notify instructor
  if (assessment.createdBy) {
    sendSubmissionReceivedEmail(assessment.createdBy, req.user, assessment);
  }

  res.status(201).json({
    success: true,
    message: "Assessment submitted successfully!",
    submission,
  });
};

// ─── @PUT /api/submissions/:id/grade ─── (Instructor/Admin grades)
export const gradeSubmission = async (req, res) => {
  const { score, feedback } = req.body;

  if (score === undefined || score === null) {
    res.status(400);
    throw new Error("Score is required.");
  }

  const submission = await Submission.findById(req.params.id)
    .populate("assessment")
    .populate("learner");

  if (!submission) {
    res.status(404);
    throw new Error("Submission not found.");
  }

  submission.score = score;
  submission.feedback = feedback || "";
  submission.status = "graded";
  submission.gradedAt = new Date();
  submission.gradedBy = req.user._id;
  await submission.save();

  // Send grade email to learner
  if (submission.learner) {
    sendGradeReleasedEmail(submission.learner, submission.assessment, submission);
  }

  res.json({ success: true, message: "Submission graded.", submission });
};