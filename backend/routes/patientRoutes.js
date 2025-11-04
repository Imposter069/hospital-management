const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Patient = require("../models/patient");
const Appointment = require("../models/appointment");

const router = express.Router();

// 🧾 Patient Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, age, gender } = req.body;

    const existingPatient = await Patient.findOne({ email });
    if (existingPatient)
      return res.json({ success: false, message: "Patient already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const patient = new Patient({
      name,
      email,
      password: hashedPassword,
      age,
      gender
    });

    await patient.save();
    res.json({ success: true, message: "Patient registered successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 🔐 Patient Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const patient = await Patient.findOne({ email });
    if (!patient)
      return res.json({ success: false, message: "Patient not found" });

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch)
      return res.json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: patient._id }, "secretKey", { expiresIn: "1h" });

    res.json({ success: true, token, patient });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 📅 Book Appointment
router.post("/book-appointment", async (req, res) => {
  try {
    const { doctor_id, patient_id, date, time, reason } = req.body;

    const appointment = new Appointment({
      doctor_id,
      patient_id,
      date,
      time,
      reason
    });

    await appointment.save();
    res.json({ success: true, message: "Appointment booked successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 📋 Get Patient Appointments
router.get("/:patientId/appointments", async (req, res) => {
  try {
    const { patientId } = req.params;
    const appointments = await Appointment.find({ patient_id: patientId });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
