import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ─── Protect: verify JWT ───
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized. No token provided.");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id).select("-password");

  if (!req.user) {
    res.status(401);
    throw new Error("User no longer exists.");
  }

  if (!req.user.isActive) {
    res.status(403);
    throw new Error("Your account has been deactivated.");
  }

  next();
};

// ─── Role-based access ───
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(
        `Role '${req.user.role}' is not authorized to access this route.`
      );
    }
    next();
  };
};

// Shorthand guards
export const adminOnly = authorize("admin");
export const instructorOnly = authorize("instructor", "admin");
export const learnerOnly = authorize("learner");