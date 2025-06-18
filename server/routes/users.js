var express = require("express");
var userRouter = express.Router();
const User = require("../model/userModel");
const mongoose = require("mongoose");

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

module.exports = userRouter;
