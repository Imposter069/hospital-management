const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  patient_name: { type: String, required: true },
  appointment_date: { type: String, required: true },
  appointment_time: { type: String, required: true },
  status: { type: String, default: "Scheduled" }
});

module.exports = mongoose.model("Appointment", appointmentSchema);
