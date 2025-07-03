const express = require("express");
const Booking = require("../model/bookingModel");
const bookingRouter = express.Router();

// Book appointment
bookingRouter.post("/book", async (req, res) => {
  const { doctorId, patientId, problem, description, date, time } = req.body;

  if (!doctorId || !patientId || !problem || !date || !time) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const booking = await Booking.create({
      doctor: doctorId,
      patient: patientId, // ✅ store patient ref
      problem,
      description,
      date,
      time,
    });

    res.status(201).json({ message: "Booked Successfully", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Booking failed" });
  }
});

// Fetch appointments for a doctor
bookingRouter.get("/doctor/:doctorId", async (req, res) => {
  try {
    const bookings = await Booking.find({ doctor: req.params.doctorId })
      .populate("patient", "fullName email") // ✅ populate patient fields
      .sort({ date: 1 });

    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching appointments" });
  }
});

// Update appointment status (confirm/reject)
bookingRouter.put("/status/:id", async (req, res) => {
  const { status } = req.body;
  if (!["confirmed", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.json({ message: `Appointment ${status}`, booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating status" });
  }
});

module.exports = bookingRouter;
