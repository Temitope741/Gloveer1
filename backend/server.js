import "express-async-errors";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import { errorHandler, notFound } from "./src/middleware/errorMiddleware.js";

// Route imports
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import courseRoutes from "./src/routes/courseRoutes.js";
import assessmentRoutes from "./src/routes/assessmentRoutes.js";
import submissionRoutes from "./src/routes/submissionRoutes.js";
import progressRoutes from "./src/routes/progressRoutes.js";
import uploadRoutes from "./src/routes/uploadRoutes.js";

dotenv.config();

const app = express();

// ─── Connect to MongoDB ───
connectDB();

// ─── Middleware ───
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:8080",
  credentials: true,
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/upload", uploadRoutes);

// ─── Health check ───
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Gloveer API is running 🚀" });
});

// ─── Error Handling ───
app.use(notFound);
app.use(errorHandler);

// ─── Start Server ───
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});


