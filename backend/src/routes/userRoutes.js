import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  deactivateUser,
  getUserStats,
} from "../controllers/userController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/", getAllUsers);
router.get("/stats", getUserStats);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.put("/:id/deactivate", deactivateUser);

export default router;