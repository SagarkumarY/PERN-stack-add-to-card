// Import Arcjet security modules
import arcjet, { tokenBucket, shield, detectBot} from "@arcjet/node";

// Load environment variables from .env file
import "dotenv/config";

// Initialize Arcjet for security, bot protection, and rate limiting
export const aj = arcjet({
  key: process.env.ARCJET_KEY, // 🔑 Arcjet API key (stored in .env file)

  characteristics: ["ip.src"], // 🛜 Track requests based on source IP address

  rules: [ // ✅ Define security rules

    // 🛡️ 1. Security Shield: Protects against SQL Injection, XSS, CSRF, etc.
    shield({ mode: "LIVE" }), // 🔹 Mode should always be "LIVE" for active protection

    // 🤖 2. Bot Detection: Blocks all bots EXCEPT search engines (Google, Bing, etc.)
    detectBot({
      mode: "LIVE", // ✅ Active mode (must be uppercase)
      allow: [
        "CATEGORY:SEARCH_ENGINE", // ✅ Allows search engine crawlers
        // Full bot list: https://arcjet.com/bot-list
      ],
    }),

    // ⚡ 3. Rate Limiting: Using "Token Bucket" algorithm
    tokenBucket({
      mode: "LIVE", // ✅ Active mode
      refillRate: 30, // ⏳ Adds 30 new tokens (requests) every 5 seconds
      interval: 5, // ⏳ Interval (in seconds)
      capacity: 20, // 🚀 Max allowed requests before throttling
    }),
    // tokenBucket({ mode: "LIVE", refillRate: 10, interval: 5, capacity: 20 })

  ],
});
