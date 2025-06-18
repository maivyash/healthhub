const express = require("express");

const { loginPoster, checkLogin } = require("../controller/login");

const loginRouter = express.Router();
const JWT_SECRET = "eknumbertujhikambarchallshekasheki";

loginRouter.post("/", loginPoster);
loginRouter.post("/checklogin", checkLogin);

module.exports = loginRouter;
