import { sendResponse } from "../utils/response.js";

/**
 * Centralized error handler middleware.
 * Controllers should throw Errors; this handler will format the response.
 */
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  // Default to 500 if statusCode is not provided
  const statusCode = err.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : 500;

  // Basic logging; in real production you might integrate with a logger like Winston
  // eslint-disable-next-line no-console
  console.error(err);

  const message =
    statusCode === 500 ? "Internal server error. Please try again later." : err.message;

  return sendResponse(res, {
    success: false,
    message,
    data: null,
    statusCode
  });
};

