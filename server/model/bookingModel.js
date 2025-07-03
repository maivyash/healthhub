const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  doctor: { type: Schema.Types.ObjectId, ref: "User", required: true },
  patient: { type: Schema.Types.ObjectId, ref: "User", required: true },
  problem: { type: String, required: true },
  description: { type: String },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "confirmed", "rejected"],
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
