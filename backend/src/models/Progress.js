import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    learner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    completedMaterials: [
      {
        type: mongoose.Schema.Types.ObjectId, // material _id
      },
    ],
    percentComplete: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// One progress record per learner per course
progressSchema.index({ learner: 1, course: 1 }, { unique: true });

export default mongoose.model("Progress", progressSchema);