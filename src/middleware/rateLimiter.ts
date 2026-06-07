import rateLimit from "express-rate-limit";

/**
 * ── Global API Rate Limiter ──────────────────────────────────
 * Limits client requests per IP address to prevent API abuse.
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // Limit each IP to 100 requests per 15-minute window
  message: {
    status: "error",
    statusCode: 429,
    message: "Too many requests from this IP. Please try again after 15 minutes.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the deprecated `X-RateLimit-*` headers
});
