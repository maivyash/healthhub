const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  createdby: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  pathologyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  roomName: {
    type: String,
    required: true,
    trim: true,
  },
  mobilenumber: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/, // Only 10-digit numbers
  },
  problem: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;
