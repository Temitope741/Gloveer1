import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [80, "Name cannot exceed 80 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "instructor", "learner"],
      default: "learner",
    },
    avatar: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      maxlength: [500, "Bio cannot exceed 500 characters"],
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    teachingCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    lastLogin: {
      type: Date,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

// ─── Hash password before saving ───
userSchema.pre("save", function(next) {
  const user = this;

  // Only hash if password is modified
  if (!user.isModified("password")) {
    return next();
  }

  // Skip if already hashed
  if (user.password && user.password.startsWith("$2")) {
    return next();
  }

  // Hash the password
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

// ─── Compare password method ───
userSchema.methods.comparePassword = function(enteredPassword, callback) {
  bcrypt.compare(enteredPassword, this.password, callback);
};

const User = mongoose.model("User", userSchema);

export default User;