import Course from "../models/Course.js";
import User from "../models/User.js";
import Progress from "../models/Progress.js";
import { sendCourseAssignedEmail } from "../services/emailService.js";

// ─── @GET /api/courses ───
export const getAllCourses = async (req, res) => {
  const { category, search } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (search) filter.title = { $regex: search, $options: "i" };

  // Instructors only see their own courses
  if (req.user.role === "instructor") filter.instructor = req.user._id;

  // Learners only see courses they're enrolled in
  if (req.user.role === "learner") filter.enrolledLearners = req.user._id;

  const courses = await Course.find(filter)
    .populate("instructor", "name email avatar")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: courses.length, courses });
};

// ─── @GET /api/courses/:id ───
export const getCourseById = async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate("instructor", "name email avatar")
    .populate("enrolledLearners", "name email avatar");

  if (!course) {
    res.status(404);
    throw new Error("Course not found.");
  }

  res.json({ success: true, course });
};

// ─── @POST /api/courses ─── (Admin + Instructor)
export const createCourse = async (req, res) => {
  const { title, description, category, durationWeeks, tags } = req.body;

  if (!title || !description || !category) {
    res.status(400);
    throw new Error("Title, description and category are required.");
  }

  const instructorId =
    req.user.role === "admin" && req.body.instructorId
      ? req.body.instructorId
      : req.user._id;

  const course = await Course.create({
    title,
    description,
    category,
    durationWeeks: durationWeeks || 4,
    tags: tags || [],
    instructor: instructorId,
  });

  // Add to instructor's teachingCourses
  await User.findByIdAndUpdate(instructorId, {
    $addToSet: { teachingCourses: course._id },
  });

  const populated = await course.populate("instructor", "name email");

  res.status(201).json({ success: true, message: "Course created.", course: populated });
};

// ─── @PUT /api/courses/:id ─── (Admin + Instructor)
export const updateCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error("Course not found.");
  }

  // Instructors can only edit their own courses
  if (
    req.user.role === "instructor" &&
    course.instructor.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error("Not authorized to edit this course.");
  }

  const updated = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate("instructor", "name email");

  res.json({ success: true, message: "Course updated.", course: updated });
};

// ─── @DELETE /api/courses/:id ─── (Admin + Instructor)
export const deleteCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error("Course not found.");
  }

  if (
    req.user.role === "instructor" &&
    course.instructor.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error("Not authorized to delete this course.");
  }

  await course.deleteOne();

  res.json({ success: true, message: "Course deleted." });
};

// ─── @POST /api/courses/:id/assign ─── Assign learners to a course
export const assignLearners = async (req, res) => {
  const { learnerIds } = req.body;

  if (!learnerIds || !Array.isArray(learnerIds)) {
    res.status(400);
    throw new Error("Please provide an array of learner IDs.");
  }

  const course = await Course.findById(req.params.id);
  if (!course) {
    res.status(404);
    throw new Error("Course not found.");
  }

  // Add learners to course
  const newLearners = learnerIds.filter(
    (id) => !course.enrolledLearners.map((l) => l.toString()).includes(id)
  );

  course.enrolledLearners.push(...newLearners);
  await course.save();

  // Update each learner's enrolledCourses + send email
  for (const learnerId of newLearners) {
    await User.findByIdAndUpdate(learnerId, {
      $addToSet: { enrolledCourses: course._id },
    });

    // Create progress record
    await Progress.findOneAndUpdate(
      { learner: learnerId, course: course._id },
      { learner: learnerId, course: course._id },
      { upsert: true, new: true }
    );

    // Send email notification
    const learner = await User.findById(learnerId);
    if (learner) sendCourseAssignedEmail(learner, course);
  }

  const updated = await Course.findById(req.params.id).populate(
    "enrolledLearners",
    "name email"
  );

  res.json({ success: true, message: "Learners assigned.", course: updated });
};

// ─── @POST /api/courses/:id/materials ─── Add material
export const addMaterial = async (req, res) => {
  const { title, fileUrl, publicId, fileType, downloadable } = req.body;

  if (!title || !fileUrl || !fileType) {
    res.status(400);
    throw new Error("Title, file URL and file type are required.");
  }

  const course = await Course.findById(req.params.id);
  if (!course) {
    res.status(404);
    throw new Error("Course not found.");
  }

  course.materials.push({
    title,
    fileUrl,
    publicId: publicId || "",
    fileType,
    downloadable: downloadable ?? true,
    uploadedBy: req.user._id,
  });

  await course.save();

  res.status(201).json({
    success: true,
    message: "Material added.",
    materials: course.materials,
  });
};

// ─── @DELETE /api/courses/:id/materials/:materialId ─── Remove material
export const deleteMaterial = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    res.status(404);
    throw new Error("Course not found.");
  }

  course.materials = course.materials.filter(
    (m) => m._id.toString() !== req.params.materialId
  );

  await course.save();

  res.json({ success: true, message: "Material removed.", materials: course.materials });
};