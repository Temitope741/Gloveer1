import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { sendWelcomeEmail } from "../services/emailService.js";

// ─── @POST /api/auth/register ───
export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide name, email and password.");
  }

  // Prevent self-assigning admin role
  const assignedRole = role === "admin" ? "learner" : (role || "learner");

  // Check if email already exists
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    res.status(400);
    throw new Error("An account with this email already exists.");
  }

  // Create user
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
    role: assignedRole,
  });

  // Send welcome email (non-blocking)
  sendWelcomeEmail(user);

  res.status(201).json({
    success: true,
    message: "Account created successfully.",
    token: generateToken(user._id, user.role),
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  });
};

// ─── @POST /api/auth/login ───
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password.");
  }

  // Find user and include password for comparison
  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password.");
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error("Your account has been deactivated. Contact admin.");
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  res.json({
    success: true,
    message: "Logged in successfully.",
    token: generateToken(user._id, user.role),
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  });
};

// ─── @GET /api/auth/me ───
export const getMe = async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate("enrolledCourses", "title category thumbnail")
    .populate("teachingCourses", "title category thumbnail");

  res.json({
    success: true,
    user,
  });
};

// ─── @PUT /api/auth/update-profile ───
export const updateProfile = async (req, res) => {
  const { name, bio, avatar } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, bio, avatar },
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    message: "Profile updated.",
    user,
  });
};

// ─── @PUT /api/auth/change-password ───
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");

  if (!(await user.comparePassword(currentPassword))) {
    res.status(400);
    throw new Error("Current password is incorrect.");
  }

  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: "Password changed successfully.",
    token: generateToken(user._id, user.role),
  });
};