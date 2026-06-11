import Assessment from "../models/Assessment.js";
import User from "../models/User.js";
import { sendAssessmentAssignedEmail } from "../services/emailService.js";

// ─── @GET /api/assessments ───
export const getAllAssessments = async (req, res) => {
  const filter = {};

  if (req.user.role === "instructor") filter.createdBy = req.user._id;
  if (req.user.role === "learner") filter.assignedLearners = req.user._id;

  const assessments = await Assessment.find(filter)
    .populate("createdBy", "name email")
    .populate("course", "title category")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: assessments.length, assessments });
};

// ─── @GET /api/assessments/:id ───
export const getAssessmentById = async (req, res) => {
  const assessment = await Assessment.findById(req.params.id)
    .populate("createdBy", "name email")
    .populate("course", "title category")
    .populate("assignedLearners", "name email");

  if (!assessment) {
    res.status(404);
    throw new Error("Assessment not found.");
  }

  res.json({ success: true, assessment });
};

// ─── @POST /api/assessments ─── (Admin + Instructor)
export const createAssessment = async (req, res) => {
  const { title, description, courseId, deadline, questions, totalMarks, passMark, assignedLearners } = req.body;

  if (!title || !courseId || !deadline || !questions?.length) {
    res.status(400);
    throw new Error("Title, course, deadline and at least one question are required.");
  }

  const assessment = await Assessment.create({
    title,
    description: description || "",
    course: courseId,
    createdBy: req.user._id,
    deadline: new Date(deadline),
    questions,
    totalMarks: totalMarks || 100,
    passMark: passMark || 50,
    assignedLearners: assignedLearners || [],
  });

  // Send email to assigned learners
  if (assignedLearners?.length) {
    for (const learnerId of assignedLearners) {
      const learner = await User.findById(learnerId);
      if (learner) sendAssessmentAssignedEmail(learner, assessment);
    }
  }

  const populated = await assessment.populate([
    { path: "createdBy", select: "name email" },
    { path: "course", select: "title category" },
  ]);

  res.status(201).json({ success: true, message: "Assessment created.", assessment: populated });
};

// ─── @PUT /api/assessments/:id ───
export const updateAssessment = async (req, res) => {
  const assessment = await Assessment.findById(req.params.id);

  if (!assessment) {
    res.status(404);
    throw new Error("Assessment not found.");
  }

  if (
    req.user.role === "instructor" &&
    assessment.createdBy.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error("Not authorized to edit this assessment.");
  }

  const updated = await Assessment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({ success: true, message: "Assessment updated.", assessment: updated });
};

// ─── @DELETE /api/assessments/:id ───
export const deleteAssessment = async (req, res) => {
  const assessment = await Assessment.findById(req.params.id);

  if (!assessment) {
    res.status(404);
    throw new Error("Assessment not found.");
  }

  if (
    req.user.role === "instructor" &&
    assessment.createdBy.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error("Not authorized to delete this assessment.");
  }

  await assessment.deleteOne();

  res.json({ success: true, message: "Assessment deleted." });
};