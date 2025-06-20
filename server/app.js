var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const registerRouter = require("./routes/register");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const loginRouter = require("./routes/login");
const reports = require("./routes/reports");
const summaryRouter = require("./routes/summary");
const userRouter = require("./routes/users");
const roomRouter = require("./routes/rooms");
const chatRouter = require("./routes/chat");

var app = express();

app.use(cors());
app.use(express.json());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//main start
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/reports", reports);
app.use("/summary", summaryRouter);
app.use("/users", userRouter);
app.use("/rooms", roomRouter);
app.use("/chat", chatRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get("/", (req, res) => {
  res.json({ error: "Your Access is Denied" });
});

//main ends
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

mongoose.connect("mongodb://127.0.0.1:27017/HealthHub", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
