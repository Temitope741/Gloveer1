import express from "express";
import {
  getAllAssessments,
  getAssessmentById,
  createAssessment,
  updateAssessment,
  deleteAssessment,
} from "../controllers/assessmentController.js";
import { protect, instructorOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getAllAssessments);
router.get("/:id", getAssessmentById);
router.post("/", instructorOnly, createAssessment);
router.put("/:id", instructorOnly, updateAssessment);
router.delete("/:id", instructorOnly, deleteAssessment);

export default router;