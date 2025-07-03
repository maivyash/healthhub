require("dotenv").config(); // ✅ Load environment variables early
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

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

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// Middleware
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/reports", reportsRouter);
app.use("/summary", summaryRouter);
app.use("/users", userRouter);
app.use("/rooms", roomRouter);
app.use("/chat", chatRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static("uploads"));
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
