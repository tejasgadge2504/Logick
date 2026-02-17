// Utility to classify log lines as safe, suspicious, or malicious

/**
 * Classify a single log line into a category.
 *
 * Categories (all lowercase):
 * - "malicious"
 * - "suspicious"
 * - "safe"
 *
 * @param {string} logLine
 * @returns {{ category: "safe" | "suspicious" | "malicious", reason: string }}
 */
// export const classifyLogLine = (logLine) => {
//   if (typeof logLine !== "string") {
//     return {
//       category: "safe",
//       reason: "Non-string log input treated as safe"
//     };
//   }

//   // 🔥 CLEAN ONLY FOR DETECTION (NOT STORAGE)
//   const scanLine = logLine.replace(/[\u0000-\u001F\u007F-\u009F\uFEFF]/g, "");

//   // 🚨 LOG4SHELL — anywhere in the line
//   const log4jRegex = /\$\{jndi\s*:\s*(ldap|rmi|dns|http|https)\s*:\/\/[^}]+}/i;

//   if (log4jRegex.test(scanLine)) {
//     return {
//       category: "malicious",
//       reason: "log4shell jndi injection detected"
//     };
//   }

//   // ⚠️ Suspicious indicators
//   const suspiciousRegex = /(ldap|jndi|exploit\.class|exploit)/i;

//   if (suspiciousRegex.test(scanLine)) {
//     return {
//       category: "suspicious",
//       reason: "suspicious log4j-related activity"
//     };
//   }

//   return {
//     category: "safe",
//     reason: "normal application log"
//   };
// };
export const classifyLogLine = (logLine) => {
  if (typeof logLine !== "string") {
    return {
      category: "safe",
      reason: "Non-string log input treated as safe"
    };
  }

  let normalized = logLine;

  // ---------------------------------------------------
  // 🔁 STEP 1: Multi-pass URL decoding (3 rounds max)
  // ---------------------------------------------------
  for (let i = 0; i < 3; i++) {
    try {
      const decoded = decodeURIComponent(normalized);
      if (decoded === normalized) break;
      normalized = decoded;
    } catch {
      break;
    }
  }

  // ---------------------------------------------------
  // 🧹 STEP 2: Remove control characters
  // ---------------------------------------------------
  normalized = normalized.replace(
    /[\u0000-\u001F\u007F-\u009F\uFEFF]/g,
    ""
  );

  // ---------------------------------------------------
  // 🔡 STEP 3: Lowercase normalization
  // ---------------------------------------------------
  normalized = normalized.toLowerCase();

  // ---------------------------------------------------
  // 🧠 STEP 4: Deobfuscation tricks
  // ---------------------------------------------------

  // ${::-x} → x
  normalized = normalized.replace(/\$\{::-(.)}/g, "$1");

  // ${lower:x} → x
  normalized = normalized.replace(/\$\{lower:(.)}/g, "$1");

  // ${upper:x} → x
  normalized = normalized.replace(/\$\{upper:(.)}/g, "$1");

  // Remove repeated ${ and }
  normalized = normalized.replace(/\$\{+/g, "${");

  // ---------------------------------------------------
  // 🔁 STEP 5: Simple recursive flattening (limited)
  // ---------------------------------------------------
  for (let i = 0; i < 3; i++) {
    const flattened = normalized.replace(/\$\{([^{}]*)}/g, "$1");
    if (flattened === normalized) break;
    normalized = flattened;
  }

  // ---------------------------------------------------
  // 🚨 STEP 6: Strong detection logic
  // ---------------------------------------------------

  // A. Direct jndi lookup pattern
  if (/\$\{.*?jndi\s*:.*?}/i.test(logLine)) {
    return {
      category: "malicious",
      reason: "direct jndi lookup detected"
    };
  }

  // B. After normalization, check for jndi:
  if (normalized.includes("jndi:")) {
    return {
      category: "malicious",
      reason: "obfuscated jndi lookup detected"
    };
  }

  // C. Aggressive heuristic:
  // Remove non-letters and check for jndi
  const lettersOnly = normalized.replace(/[^a-z]/g, "");

  if (lettersOnly.includes("jndi")) {
    return {
      category: "malicious",
      reason: "heavily obfuscated jndi pattern detected"
    };
  }

  // ---------------------------------------------------
  // ⚠️ Suspicious indicators
  // ---------------------------------------------------
  if (/(ldap|rmi|dns|iiop|corba|exploit\.class)/i.test(normalized)) {
    return {
      category: "suspicious",
      reason: "suspicious log4j-related activity"
    };
  }

  return {
    category: "safe",
    reason: "normal application log"
  };
};

