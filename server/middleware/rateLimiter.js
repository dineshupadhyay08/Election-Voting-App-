const rateLimit = require("express-rate-limit");

// General API rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limiter for auth routes (login, register)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message:
      "Too many authentication attempts, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limiter for voting
const voteLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1, // limit each IP to 1 vote per minute
  message: {
    success: false,
    message: "You have already voted recently",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { generalLimiter, authLimiter, voteLimiter };
