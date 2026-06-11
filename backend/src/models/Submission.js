import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  answer: {
    type: String,
    default: "",
  },
  fileUrl: {
    type: String,
    default: "", // for file upload answers
  },
});

const submissionSchema = new mongoose.Schema(
  {
    assessment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assessment",
      required: true,
    },
    learner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    answers: [answerSchema],
    score: {
      type: Number,
      default: null,
    },
    feedback: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["submitted", "graded"],
      default: "submitted",
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    gradedAt: {
      type: Date,
    },
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// One submission per learner per assessment
submissionSchema.index({ assessment: 1, learner: 1 }, { unique: true });

export default mongoose.model("Submission", submissionSchema);