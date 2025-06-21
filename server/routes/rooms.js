const express = require("express");
const mongoose = require("mongoose");
const Room = require("../model/rooms");
const User = require("../model/userModel");

const roomRouter = express.Router();

roomRouter.post("/", async (req, res) => {
  const { createdby, doctorId, pathologyId, roomName, mobilenumber, problem } =
    req.query;

  // Validate all fields exist
  if (
    !createdby ||
    !doctorId ||
    !pathologyId ||
    !roomName ||
    !mobilenumber ||
    !problem
  ) {
    return res.status(424).json({ error: "All fields are required" });
  }

  // Validate ObjectIds
  const ids = { createdby, doctorId, pathologyId };
  for (let [key, value] of Object.entries(ids)) {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return res.status(424).json({ error: `Invalid ID format for ${key}` });
    }
  }

  // Validate mobile number
  if (!/^[0-9]{10}$/.test(mobilenumber)) {
    return res.status(424).json({ error: "Invalid mobile number" });
  }

  try {
    // Check if users exist
    const [creator, doctor, pathologist] = await Promise.all([
      User.findById(createdby),
      User.findById(doctorId),
      User.findById(pathologyId),
    ]);

    if (!creator) return res.status(425).json({ error: "Login Again" });
    if (!doctor || doctor.role !== "doctor")
      return res
        .status(424)
        .json({ error: "Doctor not found or invalid role" });
    if (!pathologist || pathologist.role !== "pathologist")
      return res
        .status(424)
        .json({ error: "Pathologist not found or invalid role" });

    // Create the room
    const room = new Room({
      createdby,
      doctorId,
      pathologyId,
      roomName,
      mobilenumber,
      problem,
    });

    await room.save();

    return res.status(200).json({ message: "Room created successfully", room });
  } catch (err) {
    console.error("Room creation error:", err);
    return res.status(424).json({ error: "Internal server error" });
  }
});

roomRouter.get("/", async (req, res) => {
  const { createdby, doctorId, pathologyId } = req.query;

  let filter = {};
  if (createdby) {
    if (!mongoose.Types.ObjectId.isValid(createdby)) {
      return res.status(424).json({ error: "Invalid 'createdby' ID" });
    }
    filter.createdby = createdby;
  }

  if (doctorId) {
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(424).json({ error: "Invalid 'doctorId' ID" });
    }
    filter.doctorId = doctorId;
  }

  if (pathologyId) {
    if (!mongoose.Types.ObjectId.isValid(pathologyId)) {
      return res.status(424).json({ error: "Invalid 'pathologyId' ID" });
    }
    filter.pathologyId = pathologyId;
  }

  // If no filter at all, reject request
  if (Object.keys(filter).length === 0) {
    return res.status(400).json({ error: "Missing query parameters" });
  }

  try {
    const rooms = await Room.find(filter)
      .populate("createdby", "fullName")
      .populate("doctorId", "fullName")
      .populate("pathologyId", "fullName")
      .sort({ createdAt: -1 });

    const formattedRooms = rooms.map((room) => ({
      _id: room._id,
      roomName: room.roomName,
      doctor: room.doctorId?.fullName || "Unknown Doctor", //changed
      doctorId: room.doctorId,
      pathologyId: room.pathologyId,
      pathology: room.pathologyId?.fullName || "Unknown Lab",
      patient: room.createdby?.fullName || "Unknown Patient",
      createdOn: room.createdAt,
      createdby: room.createdby?._id,
    }));

    return res.status(200).json(formattedRooms);
  } catch (err) {
    console.error("Error fetching rooms:", err);
    return res.status(500).json({ error: "Failed to fetch rooms" });
  }
});

roomRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(424).json({ error: "Invalid Room ID" });
  }

  try {
    const deleted = await Room.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(424)
        .json({ error: "Room not found or already deleted" });
    }

    return res.status(200).json({ message: "Room deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    return res.status(424).json({ error: "Failed to delete room" });
  }
});

module.exports = roomRouter;
