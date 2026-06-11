import express from "express";
import {
  getMyProgress,
  getCourseProgress,
  completeMaterial,
} from "../controllers/progressController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getMyProgress);
router.get("/:courseId", getCourseProgress);
router.put("/:courseId/complete-material", completeMaterial);

export default router;