const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const JWT_SECRET = "eknumbertujhikambarchallshekasheki";

const loginPoster = async (req, res) => {
  try {
    const { role, email, password } = req.body;

    if (!role || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!["doctor", "patient", "pathologist"].includes(role)) {
      return res.status(403).json({ message: "Invalid role provided" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.hashpassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.fullName },
      JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      role: user.role,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.fullName,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};
function checkLogin(req, res) {
  const token = req.body.token;

  if (!token) {
    return res.status(400).json({ error: "No token provided" });
  }

  try {
    const opentoken = jwt.verify(token, JWT_SECRET);

    return res.status(200).json({ token: opentoken });
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = { loginPoster, checkLogin };
