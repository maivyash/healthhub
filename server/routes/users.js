var express = require("express");
var userRouter = express.Router();
const User = require("../model/userModel");
const mongoose = require("mongoose");
const { authenticateToken } = require("../helper/middleware");

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/avatars"); // Create this folder if it doesn’t exist
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unique name
  },
});

const upload = multer({ storage: storage });
const fs = require("fs");

const uploadPath = path.join(__dirname, "uploads/avatars");

// Check and create directory if it doesn't exist
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

/* GET users listing. */
userRouter.get("/", function (req, res, next) {
  res.statusCode(404).send("respond with a resource");
});
userRouter.get("/getDoctor", async (req, res) => {
  const id = req.query.id;
  if (!(id.length === 24)) {
    return res.status(424).json({ error: "Enter Valid User Id" });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(424).json({ error: "Enter Valid User Id" });
  }
  const user = await User.findById(id);
  console.log(user);

  if (!user) {
    return res.status(424).json({ error: "No User Found" });
  } else if (!(user.role === "doctor")) {
    return res.status(424).json({ error: "Id is Not a Doctor" });
  } else {
    return res.status(200).json({ doctorname: user.fullName });
  }
});
userRouter.get("/getPathologist", async (req, res) => {
  const id = req.query.id;
  if (!(id.length === 24)) {
    return res.status(424).json({ error: "Enter Valid User Id" });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(424).json({ error: "Enter Valid User Id" });
  }
  const user = await User.findById(id);
  console.log(user);

  if (!user) {
    return res.status(424).json({ error: "No User Found" });
  } else if (!(user.role === "pathologist")) {
    return res.status(424).json({ error: "Id is Not a Pathologist" });
  } else {
    return res.status(200).json({ pathologyName: user.fullName });
  }
});

//for avatar
userRouter.put("/updateprofile", upload.single("avatar"), async (req, res) => {
  try {
    const userId = req.body.uid;
    const updates = { ...req.body };

    delete updates._id;
    delete updates.role;
    delete updates.email;
    delete updates.hashpassword;

    if (req.file) {
      updates.avatarUrl = `/uploads/avatars/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Profile update error:", err);
    res
      .status(500)
      .json({ message: "Error updating profile", error: err.message });
  }
});
//fethiing doctors
// GET /users/doctors
userRouter.get("/doctors", async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select(
      "fullName specialization avatarUrl workingDays city"
    );
    res.json({ doctors });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching doctors" });
  }
});

module.exports = userRouter;
