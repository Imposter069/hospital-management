const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    doctorName: {
      type: String,
      required: true,
      trim: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    patientName: {
      type: String,
      required: true,
      trim: true,
    },
    notes: {
      type: String,
      default: "No notes provided",
      trim: true,
    },
    photos: {
      type: String, // Base64 image string or file URL
      default: "",
    },
  },
  {
    timestamps: true, // auto adds createdAt & updatedAt fields
  }
);

module.exports = mongoose.model("Record", recordSchema);
