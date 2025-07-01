var express = require("express");
var userRouter = express.Router();
const User = require("../model/userModel");
const mongoose = require("mongoose");
const { authenticateToken } = require("../helper/middleware");

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

// Update profile route
userRouter.put("/updateProfile", async (req, res) => {
  try {
    const userId = req.body.uid;
    console.log(userId);

    const updates = req.body;

    // Remove fields that shouldn't be updated
    delete updates._id;
    delete updates.role;
    delete updates.email;

    delete updates.hashpassword;

    // Find and update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
});

module.exports = userRouter;
