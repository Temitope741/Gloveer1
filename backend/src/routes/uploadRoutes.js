import express from "express";
import { protect, instructorOnly } from "../middleware/authMiddleware.js";
import cloudinary from "../config/cloudinary.js";
import multer from "multer";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB

router.post("/", protect, instructorOnly, upload.single("file"), async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded.");
  }

  const b64 = Buffer.from(req.file.buffer).toString("base64");
  const dataURI = `data:${req.file.mimetype};base64,${b64}`;

  const result = await cloudinary.uploader.upload(dataURI, {
    folder: "gloveer/materials",
    resource_type: "auto",
  });

  res.json({
    success: true,
    fileUrl: result.secure_url,
    publicId: result.public_id,
    fileType: req.file.mimetype,
  });
});

export default router;