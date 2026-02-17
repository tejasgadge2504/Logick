import crypto from "crypto";

/**
 * Generate a random clientId and clientSecret for a user.
 * - clientId: URL-safe identifier
 * - clientSecret: high-entropy token to be hashed before storage
 */
export const generateClientCreds = () => {
  const clientId = `cl_${crypto.randomBytes(12).toString("hex")}`;
  const clientSecret = crypto.randomBytes(32).toString("hex");

  return { clientId, clientSecret };
};

