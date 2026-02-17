import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { sendResponse } from "../utils/response.js";
import { User } from "../models/User.js";

/**
 * Authentication middleware to protect routes.
 * - Expects Authorization: Bearer <token>
 * - Validates JWT and attaches user to request.
 */
export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendResponse(res, {
      success: false,
      message: "Missing or malformed authorization header",
      data: null,
      statusCode: 401
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return sendResponse(res, {
        success: false,
        message: "User associated with token not found",
        data: null,
        statusCode: 401
      });
    }

    req.user = {
      id: user._id.toString(),
      email: user.email
    };

    return next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return sendResponse(res, {
        success: false,
        message: "Token has expired",
        data: null,
        statusCode: 401
      });
    }

    return sendResponse(res, {
      success: false,
      message: "Invalid token",
      data: null,
      statusCode: 401
    });
  }
};

