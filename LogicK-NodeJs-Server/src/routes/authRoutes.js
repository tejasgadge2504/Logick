import express from "express";
import { register, login, authenticateWithClientCreds } from "../controllers/authController.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/client-auth", authenticateWithClientCreds);

export default router;

