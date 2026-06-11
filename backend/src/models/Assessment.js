import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, "Question text is required"],
    trim: true,
  },
  type: {
    type: String,
    enum: ["text", "file", "multiple_choice"],
    default: "text",
  },
  options: [String], // for multiple_choice questions
  correctAnswer: {
    type: String,
    default: "", // for multiple_choice auto-grading
  },
  marks: {
    type: Number,
    default: 10,
  },
});

const assessmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Assessment title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedLearners: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    questions: [questionSchema],
    deadline: {
      type: Date,
      required: [true, "Deadline is required"],
    },
    totalMarks: {
      type: Number,
      default: 100,
    },
    passMark: {
      type: Number,
      default: 50,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    fileInstructions: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Assessment", assessmentSchema);