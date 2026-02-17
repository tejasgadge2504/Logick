import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    logText: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ["safe", "suspicious", "malicious"],
      default: "safe"
    },
    // timestamp is provided by the client SDK, not server time
    timestamp: {
      type: Number,
      required: true
    }
  },
  {
    collection: "logs"
  }
);

export const Log = mongoose.model("Log", logSchema);

