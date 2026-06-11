import Progress from "../models/Progress.js";
import Course from "../models/Course.js";

// ─── @GET /api/progress ─── (Learner's own progress)
export const getMyProgress = async (req, res) => {
  const progress = await Progress.find({ learner: req.user._id })
    .populate("course", "title category thumbnail materials")
    .sort({ lastAccessedAt: -1 });

  res.json({ success: true, count: progress.length, progress });
};

// ─── @GET /api/progress/:courseId ─── (Progress for one course)
export const getCourseProgress = async (req, res) => {
  const learnerId =
    req.user.role === "learner" ? req.user._id : req.query.learnerId;

  const progress = await Progress.findOne({
    learner: learnerId,
    course: req.params.courseId,
  }).populate("course", "title category materials");

  if (!progress) {
    return res.json({
      success: true,
      progress: { percentComplete: 0, completedMaterials: [] },
    });
  }

  res.json({ success: true, progress });
};

// ─── @PUT /api/progress/:courseId/complete-material ───
export const completeMaterial = async (req, res) => {
  const { materialId } = req.body;

  if (!materialId) {
    res.status(400);
    throw new Error("Material ID is required.");
  }

  const course = await Course.findById(req.params.courseId);
  if (!course) {
    res.status(404);
    throw new Error("Course not found.");
  }

  let progress = await Progress.findOne({
    learner: req.user._id,
    course: req.params.courseId,
  });

  if (!progress) {
    progress = await Progress.create({
      learner: req.user._id,
      course: req.params.courseId,
    });
  }

  // Add material if not already completed
  if (!progress.completedMaterials.map((m) => m.toString()).includes(materialId)) {
    progress.completedMaterials.push(materialId);
  }

  // Calculate percentage
  const totalMaterials = course.materials.length;
  progress.percentComplete =
    totalMaterials > 0
      ? Math.round((progress.completedMaterials.length / totalMaterials) * 100)
      : 0;

  progress.lastAccessedAt = new Date();

  // Mark as completed if 100%
  if (progress.percentComplete === 100) {
    progress.isCompleted = true;
    progress.completedAt = new Date();
  }

  await progress.save();

  res.json({ success: true, message: "Progress updated.", progress });
};