import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import "express-async-errors";
import authRoutes from "./routes/authRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { sendResponse } from "./utils/response.js";
import { connectDB } from "./config/db.js";
import mongoose from "mongoose";

const app = express();

// Global middlewares
app.use(helmet());
app.use(
  cors({
    origin: "*"
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

// Ensure DB connection for serverless (Vercel)
// This middleware ensures DB is connected before handling requests
app.use(async (req, res, next) => {
  // Skip DB connection check for health endpoint
  if (req.path === "/health") {
    return next();
  }

  // If already connected, proceed
  if (mongoose.connection.readyState === 1) {
    return next();
  }

  // Connect if not connected (for serverless cold starts)
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// Health check
app.get("/health", (req, res) => {
  return sendResponse(res, {
    success: true,
    message: "LogiK API is healthy",
    data: null,
    statusCode: 200
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/logs", logRoutes);

// 404 handler
app.use((req, res) => {
  return sendResponse(res, {
    success: false,
    message: "Route not found",
    data: null,
    statusCode: 404
  });
});

// Centralized error handler
app.use(errorHandler);

export default app;

