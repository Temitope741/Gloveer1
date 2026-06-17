import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { sendWelcomeEmail } from "../services/emailService.js";

// ─── @POST /api/auth/register ───
export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Please provide name, email and password." });
  }

  const assignedRole = role === "admin" ? "learner" : (role || "learner");

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    return res.status(400).json({ success: false, message: "An account with this email already exists." });
  }

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
    role: assignedRole,
  });

  sendWelcomeEmail(user);

  res.status(201).json({
    success: true,
    message: "Account created successfully.",
    token: generateToken(user._id, user.role),
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  });
};

// ─── @POST /api/auth/login ───
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password." });
    }

    // Make sure to select password field explicitly
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    // Compare password
    const isPasswordValid = await new Promise((resolve, reject) => {
      user.comparePassword(password, (err, isMatch) => {
        if (err) reject(err);
        resolve(isMatch);
      });
    });
    
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: "Your account has been deactivated. Contact admin." });
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: "Logged in successfully.",
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Login failed", error: error.message });
  }
};

// ─── @GET /api/auth/me ───
export const getMe = async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate("enrolledCourses", "title category thumbnail")
    .populate("teachingCourses", "title category thumbnail");

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  res.json({
    success: true,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
      enrolledCourses: user.enrolledCourses,
      teachingCourses: user.teachingCourses,
    },
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
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
    },
  });
};

// ─── @PUT /api/auth/change-password ───
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");

  if (!(await user.comparePassword(currentPassword))) {
    return res.status(400).json({ success: false, message: "Current password is incorrect." });
  }

  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: "Password changed successfully.",
    token: generateToken(user._id, user.role),
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  });
};