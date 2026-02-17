import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    mobNo: {
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    clientId: {
      type: String,
      unique: true,
      index: true
    },
    // Hashed client secret (bcrypt)
    clientSecret: {
      type: String
    },
    // Encrypted client secret for retrieval in client details API
    clientSecretEncrypted: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    collection: "users"
  }
);

// Compare plain password with hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Compare plain client secret with hashed secret
userSchema.methods.compareClientSecret = async function (candidateSecret) {
  if (!this.clientSecret) return false;
  return bcrypt.compare(candidateSecret, this.clientSecret);
};

export const User = mongoose.model("User", userSchema);

