const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["doctor", "pathologist", "patient"],
    required: true,
  },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  hashpassword: { type: String, required: true }, // Optional if needed later

  // Doctor-specific
  specialization: String,
  license: String,
  experience: String,

  // Pathologist-specific
  labName: String,
  qualification: String,

  // Patient-specific
  age: String,
  gender: String,
  medicalHistory: String,
});

module.exports = mongoose.model("User", userSchema);
