import express from "express";
import { ingestLogs, getLogAnalysis, getUserLogs } from "../controllers/logController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected – SDK use
router.post("/ingest", authMiddleware, ingestLogs);

// Protected – user-specific log analysis
router.get("/analysis", authMiddleware, getLogAnalysis);

// Protected – get all logs (paginated) for the user
router.get("/", authMiddleware, getUserLogs);

export default router;

