import express from "express";
import { getClientDetails, refreshClientSecret } from "../controllers/clientController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected routes
router.get("/details", authMiddleware, getClientDetails);
router.post("/refresh-secret", authMiddleware, refreshClientSecret);

export default router;

