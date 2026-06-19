
const rateLimit = require("express-rate-limit");


const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
  skip: (req) => process.env.NODE_ENV !== "production",
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many authentication attempts, please try again later." },
  skip: (req) => process.env.NODE_ENV !== "production",
});

const heavyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests to AI endpoints, please try again later." },
  skip: (req) => process.env.NODE_ENV !== "production",
});

module.exports = { globalLimiter, authLimiter, heavyLimiter };
