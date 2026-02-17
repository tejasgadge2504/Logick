import "express-async-errors";
import { Log } from "../models/Log.js";
import { classifyLogLine } from "../utils/logDetection.js";
import { sendResponse } from "../utils/response.js";

/**
 * POST /api/logs/ingest
 * Protected – SDK use
 */
export const ingestLogs = async (req, res) => {
  const userId = req.user?.id;
  const payload = req.body;

  if (!Array.isArray(payload)) {
    const error = new Error("Log payload must be an array");
    error.statusCode = 400;
    throw error;
  }

  if (payload.length === 0) {
    const error = new Error("Log array cannot be empty");
    error.statusCode = 400;
    throw error;
  }

  const logsToInsert = [];

  for (const item of payload) {
    if (!item || typeof item !== "object") {
      const error = new Error("Each log entry must be an object");
      error.statusCode = 400;
      throw error;
    }

    const { logText, timestamp } = item;

    if (!logText || typeof logText !== "string") {
      const error = new Error("Each log entry requires a valid logText string");
      error.statusCode = 400;
      throw error;
    }

    if (typeof timestamp !== "number" || Number.isNaN(timestamp)) {
      const error = new Error("Each log entry requires a numeric timestamp");
      error.statusCode = 400;
      throw error;
    }

    const { category } = classifyLogLine(logText);

    logsToInsert.push({
      userId,
      logText,
      timestamp,
      category
    });
  }

  try {
    const result = await Log.insertMany(logsToInsert, { ordered: true });

    return sendResponse(res, {
      success: true,
      message: "Logs ingested successfully",
      data: {
        insertedCount: result.length
      },
      statusCode: 201
    });
  } catch (err) {
    const error = new Error("Failed to insert logs into MongoDB");
    error.statusCode = 500;
    throw error;
  }
};

/**
 * GET /api/logs/analysis
 * Protected – returns aggregated log stats for the authenticated user.
 *
 * 1) maliciousLogsDetected   – total malicious logs for the user
 * 2) totalLogs               – total logs for the user
 * 3) maliciousLogsThisWeek   – malicious logs in the last 7 days
 * 4) safenessPercentage      – percentage of safe logs out of total logs
 */
export const getLogAnalysis = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    const error = new Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }

  const now = Date.now();
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;

  const [totalLogs, maliciousLogsDetected, maliciousLogsThisWeek, safeLogs] = await Promise.all([
    Log.countDocuments({ userId }),
    Log.countDocuments({ userId, category: "malicious" }),
    Log.countDocuments({ userId, category: "malicious", timestamp: { $gte: weekAgo } }),
    Log.countDocuments({ userId, category: "safe" })
  ]);

  const safenessPercentage =
    totalLogs === 0 ? 0 : Number(((safeLogs / totalLogs) * 100).toFixed(2));

  return sendResponse(res, {
    success: true,
    message: "Log analysis fetched successfully",
    data: {
      maliciousLogsDetected,
      totalLogs,
      maliciousLogsThisWeek,
      safenessPercentage
    },
    statusCode: 200
  });
};

/**
 * GET /api/logs
 * Protected – returns paginated logs for the authenticated user.
 *
 * Query params:
 * - pageNo   (optional, default 1)
 * - pageSize (optional, default 10)
 */
export const getUserLogs = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    const error = new Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }

  const rawPageNo = parseInt(req.query.pageNo, 10);
  const rawPageSize = parseInt(req.query.pageSize, 10);

  const pageNo = Number.isNaN(rawPageNo) || rawPageNo <= 0 ? 1 : rawPageNo;
  const pageSize = Number.isNaN(rawPageSize) || rawPageSize <= 0 ? 10 : rawPageSize;

  const skip = (pageNo - 1) * pageSize;

  const [logs, totalLogs] = await Promise.all([
    Log.find({ userId })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(pageSize),
    Log.countDocuments({ userId })
  ]);

  const totalPages = pageSize === 0 ? 0 : Math.max(1, Math.ceil(totalLogs / pageSize));

  return sendResponse(res, {
    success: true,
    message: "User logs fetched successfully",
    data: {
      logs,
      pagination: {
        pageNo,
        pageSize,
        totalPages,
        totalLogs
      }
    },
    statusCode: 200
  });
};


