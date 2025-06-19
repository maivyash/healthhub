const mongoose = require("mongoose");
delete mongoose.models.Message;
const messageSchema = new mongoose.Schema({
  text: String,
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  sentBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  senderName: String,
  sentAt: {
    type: Date,
    default: Date.now,
  },
  file: {
    filename: String,
    filepath: String,
    filetype: String,
  },
});
module.exports =
  mongoose.models.ChatMessage || mongoose.model("ChatMessage", messageSchema);
