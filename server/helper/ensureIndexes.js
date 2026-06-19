/**
 * ensureIndexes.js
 * Creates MongoDB indexes for all hot query paths.
 * Called once at server startup to ensure optimal query performance.
 */
const User = require("../model/userModel");
const Booking = require("../model/bookingModel");
const Room = require("../model/rooms");
const ChatMessage = require("../model/message");
const File = require("../model/file");

async function ensureIndexes() {
  try {
    // Users — login lookup and role-based filtering
    await User.collection.createIndex({ email: 1 }, { unique: true, background: true });
    await User.collection.createIndex({ role: 1 }, { background: true });

    // Bookings — doctor appointment list sorted by date, patient history
    await Booking.collection.createIndex({ doctor: 1, date: 1 }, { background: true });
    await Booking.collection.createIndex({ patient: 1 }, { background: true });

    // Rooms — filtered by creator, doctor, pathologist
    await Room.collection.createIndex({ createdby: 1 }, { background: true });
    await Room.collection.createIndex({ doctorId: 1 }, { background: true });
    await Room.collection.createIndex({ pathologyId: 1 }, { background: true });

    // Chat messages — fetched by room, sorted by time
    await ChatMessage.collection.createIndex({ roomId: 1, sentAt: 1 }, { background: true });

    // Files — fetched by patient, doctor, pathologist
    await File.collection.createIndex({ patientId: 1 }, { background: true });
    await File.collection.createIndex({ doctorId: 1 }, { background: true });
    await File.collection.createIndex({ pathologyId: 1 }, { background: true });

    console.log("✅ All database indexes ensured");
  } catch (err) {
    console.error("⚠️ Index creation warning:", err.message);
    // Non-fatal — app continues even if index creation fails
  }
}

module.exports = { ensureIndexes };
