import mongoose from "mongoose";
import { env } from "./env.js";

// Cache the connection to reuse in serverless environments
let cachedConnection = null;

export const connectDB = async () => {
  // If connection already exists and is ready, reuse it
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  // If connection exists but is not ready, return the promise
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    // Create new connection
    cachedConnection = mongoose.connect(env.mongoUri, {
      autoIndex: env.nodeEnv !== "production",
      // Optimize for serverless
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });

    await cachedConnection;
    // eslint-disable-next-line no-console
    console.log("MongoDB connected");
    return cachedConnection;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("MongoDB connection error:", err.message);
    // In serverless, don't exit process - let Vercel handle it
    if (env.nodeEnv === "production") {
      throw err;
    }
    process.exit(1);
  }
};

