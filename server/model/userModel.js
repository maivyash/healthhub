const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["doctor", "pathologist", "patient"],
      required: true,
    },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    hashpassword: { type: String, required: true },
    city: String,
    workingDays: [{ type: String }], // Add this for availability tracking

    // Doctor-specific
    specialization: String,
    license: String, // For both doctors and pathologists
    experience: String,

    // Pathologist-specific
    labName: String,
    qualification: String,

    // Patient-specific
    age: String,
    gender: String,
  },
  { timestamps: true }
); // Adding timestamps can be helpful

module.exports = mongoose.model("User", userSchema);
