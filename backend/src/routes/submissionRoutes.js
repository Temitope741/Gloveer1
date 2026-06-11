import express from "express";
import {
  getAllSubmissions,
  getSubmissionById,
  createSubmission,
  gradeSubmission,
} from "../controllers/submissionController.js";
import { protect, instructorOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getAllSubmissions);
router.get("/:id", getSubmissionById);
router.post("/", createSubmission);
router.put("/:id/grade", instructorOnly, gradeSubmission);

export default router;