const rateLimit = require('express-rate-limit');

// General API rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { success: false, error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Login limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 attempts per IP
  message: { success: false, error: 'Too many authentication attempts' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Register limiter
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 attempts per IP
  message: { success: false, error: 'Too many registration attempts' },
  standardHeaders: true,
  legacyHeaders: false,
});

// AI endpoints — moderate
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { success: false, error: 'AI request limit reached, please wait' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { apiLimiter, loginLimiter, registerLimiter, aiLimiter };
