const express = require("express");

const { loginPoster, checkLogin } = require("../controller/login");

const loginRouter = express.Router();
const JWT_SECRET = "eknumbertujhikambarchallshekasheki";

loginRouter.post("/", loginPoster);
loginRouter.post("/checklogin", checkLogin);
loginRouter.get("/logout", (req, res) => {
  // Clear all cookies by setting them to expire immediately
  const cookieNames = Object.keys(req.cookies);
  cookieNames.forEach((name) => {
    res.clearCookie(name, {
      path: "/",
      secure: true, // if using HTTPS
      httpOnly: true,
    });
  });

  res.status(200).json({ message: "All cookies cleared" });
});

module.exports = loginRouter;
