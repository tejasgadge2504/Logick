import "express-async-errors";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { generateClientCreds } from "../utils/generateClientCreds.js";
import { sendResponse } from "../utils/response.js";
import { _decryptClientSecret, _encryptClientSecret } from "./authController.js";

/**
 * GET /api/client/details
 * Protected
 */
export const getClientDetails = async (req, res) => {
  const userId = req.user?.id;

  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const clientSecret = _decryptClientSecret(user.clientSecretEncrypted);

  return sendResponse(res, {
    success: true,
    message: "Client details fetched successfully",
    data: {
      clientId: user.clientId,
      clientSecret
    },
    statusCode: 200
  });
};

/**
 * POST /api/client/refresh-secret
 * Protected
 */
export const refreshClientSecret = async (req, res) => {
  const userId = req.user?.id;

  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const { clientSecret: newClientSecret } = generateClientCreds();

  const hashedClientSecret = await bcrypt.hash(newClientSecret, 10);
  const encryptedNewSecret = _encryptClientSecret(newClientSecret);

  user.clientSecret = hashedClientSecret;
  user.clientSecretEncrypted = encryptedNewSecret;
  await user.save();

  return sendResponse(res, {
    success: true,
    message: "Client secret refreshed successfully",
    data: {
      clientId: user.clientId,
      newClientSecret
    },
    statusCode: 200
  });
};

