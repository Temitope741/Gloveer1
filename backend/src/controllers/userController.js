import User from "../models/User.js";
import Course from "../models/Course.js";

// ─── @GET /api/users ─── (Admin only)
export const getAllUsers = async (req, res) => {
  const { role, search } = req.query;

  const filter = {};
  if (role) filter.role = role;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const users = await User.find(filter).sort({ createdAt: -1 });

  res.json({
    success: true,
    count: users.length,
    users,
  });
};

// ─── @GET /api/users/:id ─── (Admin only)
export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id)
    .populate("enrolledCourses", "title category")
    .populate("teachingCourses", "title category");

  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  res.json({ success: true, user });
};

// ─── @PUT /api/users/:id ─── (Admin only)
export const updateUser = async (req, res) => {
  const { name, email, role, isActive } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name, email, role, isActive },
    { new: true, runValidators: true }
  );

  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  res.json({ success: true, message: "User updated.", user });
};

// ─── @DELETE /api/users/:id ─── (Admin only)
export const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  // Prevent deleting yourself
  if (user._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error("You cannot delete your own account.");
  }

  await user.deleteOne();

  res.json({ success: true, message: "User deleted." });
};

// ─── @PUT /api/users/:id/deactivate ─── (Admin only)
export const deactivateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  res.json({ success: true, message: "User deactivated.", user });
};

// ─── @GET /api/users/stats ─── (Admin only)
export const getUserStats = async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalAdmins = await User.countDocuments({ role: "admin" });
  const totalInstructors = await User.countDocuments({ role: "instructor" });
  const totalLearners = await User.countDocuments({ role: "learner" });
  const activeUsers = await User.countDocuments({ isActive: true });

  res.json({
    success: true,
    stats: {
      totalUsers,
      totalAdmins,
      totalInstructors,
      totalLearners,
      activeUsers,
    },
  });
};