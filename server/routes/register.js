const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../model/userModel");
const KEY = "eknumbertujhikambarchallshekasheki";
const registerRouter = express.Router();

registerRouter.post("/", async (req, res) => {
  try {
    const { role, email } = req.body;
    console.log(role);

    //checking detail
    if (!((role == "doctor") | (role == "pathologist") | (role == "patient"))) {
      return res.status(406).json({ message: "YOU MF dont check my security" });
    }
    if (!req.body.password) {
      return res.json({ error: "password is required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already registered with this email" });
    }

    // Hash password if present
    console.log(req.body.password);
    req.body.hashpassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User(req.body);
    await newUser.save();
    newUser.hashpassword = null;
    res.status(201).json({ message: "Registration successful", user: newUser });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = registerRouter;
