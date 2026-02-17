/**
 * Standardized API response helper.
 * Ensures all responses follow:
 * { success: boolean, message: string, data: object | null }
 */
export const sendResponse = (res, { success, message, data = null, statusCode = 200 }) => {
  return res.status(statusCode).json({
    success,
    message,
    data
  });
};

