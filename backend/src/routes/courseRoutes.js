import express from "express";
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  assignLearners,
  addMaterial,
  deleteMaterial,
} from "../controllers/courseController.js";
import { protect, instructorOnly, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getAllCourses);
router.get("/:id", getCourseById);
router.post("/", instructorOnly, createCourse);
router.put("/:id", instructorOnly, updateCourse);
router.delete("/:id", instructorOnly, deleteCourse);
router.post("/:id/assign", instructorOnly, assignLearners);
router.post("/:id/materials", instructorOnly, addMaterial);
router.delete("/:id/materials/:materialId", instructorOnly, deleteMaterial);

export default router;