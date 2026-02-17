import "express-async-errors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import crypto from "crypto";
import { User } from "../models/User.js";
import { generateClientCreds } from "../utils/generateClientCreds.js";
import { sendResponse } from "../utils/response.js";
import { env } from "../config/env.js";

const SALT_ROUNDS = 10;

const generateJwtToken = (userId) => {
  return jwt.sign({ userId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
};

export const _encryptClientSecret = (plainSecret) => {
  // Simple symmetric encryption for being able to return unhashed secret from the DB
  // NOTE: In a real production system, manage this key securely (e.g., KMS).
  const encryptionKey = crypto.createHash("sha256").update(env.jwtSecret).digest(); // derive 32 bytes
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-gcm", encryptionKey, iv);
  let encrypted = cipher.update(plainSecret, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");
  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
};

const decryptSecret = (encryptedSecret) => {
  if (!encryptedSecret) return null;
  const [ivHex, authTagHex, ciphertext] = encryptedSecret.split(":");
  const encryptionKey = crypto.createHash("sha256").update(env.jwtSecret).digest();
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-gcm", encryptionKey, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(ciphertext, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

/**
 * POST /api/auth/register
 * Public
 */
export const register = async (req, res) => {
  const { email, mobNo, password } = req.body || {};

  if (!email || !mobNo || !password) {
    const error = new Error("Missing required fields: email, mobNo, and password are required");
    error.statusCode = 400;
    throw error;
  }

  if (!validator.isEmail(email)) {
    const error = new Error("Invalid email format");
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
  if (existingUser) {
    const error = new Error("Email already registered");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // Generate client credentials
  const { clientId, clientSecret } = generateClientCreds();

  const hashedClientSecret = await bcrypt.hash(clientSecret, SALT_ROUNDS);
  const encryptedClientSecret = _encryptClientSecret(clientSecret);

  const user = await User.create({
    email: email.toLowerCase().trim(),
    mobNo,
    password: hashedPassword,
    clientId,
    clientSecret: hashedClientSecret,
    clientSecretEncrypted: encryptedClientSecret
  });

  const token = generateJwtToken(user._id.toString());

  return sendResponse(res, {
    success: true,
    message: "Registration successful",
    data: {
      token,
      clientId,
      clientSecret
    },
    statusCode: 201
  });
};

/**
 * POST /api/auth/login
 * Public
 */
export const login = async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    const error = new Error("Missing required fields: email and password are required");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const token = generateJwtToken(user._id.toString());

  return sendResponse(res, {
    success: true,
    message: "Login successful",
    data: {
      token
    },
    statusCode: 200
  });
};

/**
 * POST /api/auth/client-auth
 * Public - Authenticate using clientId and clientSecret
 * Used by SDKs to get JWT token
 */
export const authenticateWithClientCreds = async (req, res) => {
  const { clientId, clientSecret } = req.body || {};

  if (!clientId || !clientSecret) {
    const error = new Error("Missing required fields: clientId and clientSecret are required");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ clientId });
  if (!user) {
    const error = new Error("Invalid client credentials");
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.compareClientSecret(clientSecret);
  if (!isMatch) {
    const error = new Error("Invalid client credentials");
    error.statusCode = 401;
    throw error;
  }

  const token = generateJwtToken(user._id.toString());

  return sendResponse(res, {
    success: true,
    message: "Authentication successful",
    data: {
      token
    },
    statusCode: 200
  });
};

// Export decrypt helper for client controller
export const _decryptClientSecret = decryptSecret;

