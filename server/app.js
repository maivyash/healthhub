require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");

// Rate limiters
const { globalLimiter, authLimiter, heavyLimiter } = require("./helper/rateLimiter");

// Routes
const registerRouter = require("./routes/register");
const loginRouter = require("./routes/login");
const reportsRouter = require("./routes/reports");
const summaryRouter = require("./routes/summary");
const userRouter = require("./routes/users");
const roomRouter = require("./routes/rooms");
const chatRouter = require("./routes/chat");
const bookingRouter = require("./routes/bookingAppoitment");

// App
const app = express();

//         MongoDB Connection \
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.6.0";
const isProd = process.env.NODE_ENV === "production";

mongoose
  .connect(mongoURI, {

    maxPoolSize: 50,
    minPoolSize: 10,
    socketTimeoutMS: 45000,
    serverSelectionTimeoutMS: 5000,
    autoIndex: !isProd,
  })
  .then(() => console.log(`MongoDB connected`))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

//          Security & Performance Middleware 
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use(compression());
app.use(cors());
app.use(logger(isProd ? "combined" : "dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Rate Limiting 
app.use(globalLimiter);

// ===== Routes with Targeted Rate Limits =====
app.use("/register", authLimiter, registerRouter);
app.use("/login", authLimiter, loginRouter);
app.use("/reports", reportsRouter); // heavyLimiter applied on specific routes inside
app.use("/summary", heavyLimiter, summaryRouter);
app.use("/users", userRouter);
app.use("/rooms", roomRouter);
app.use("/chat", chatRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/bookings", bookingRouter);

// Default route
app.get("/", (req, res) => {
  res.status(403).json({ error: "Your Access is Denied" });
});

// 404 handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({
    message: err.message,
    error: req.app.get("env") === "development" ? err : {},
  });
});

module.exports = app;
