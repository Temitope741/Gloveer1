import mongoose from "mongoose";

const materialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Material title is required"],
      trim: true,
    },
    fileUrl: {
      type: String,
      required: [true, "File URL is required"],
    },
    publicId: {
      type: String, // Cloudinary public_id for deletion
      default: "",
    },
    fileType: {
      type: String,
      enum: ["pdf", "slides", "video", "document"],
      required: true,
    },
    downloadable: {
      type: Boolean,
      default: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    category: {
      type: String,
      enum: ["Web Development", "Cybersecurity", "Data Analytics"],
      required: [true, "Category is required"],
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Instructor is required"],
    },
    enrolledLearners: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    materials: [materialSchema],
    durationWeeks: {
      type: Number,
      default: 4,
      min: 1,
      max: 52,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    thumbnail: {
      type: String,
      default: "",
    },
    tags: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);