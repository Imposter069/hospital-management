const express = require("express");
const jwt = require("jsonwebtoken");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const Record = require("../models/Record");

const router = express.Router();

/* ======================================================
   🩺 Doctor Signup
====================================================== */
router.post("/signup", async (req, res) => {
  try {
    const { name, specialization, email, password, phone, photo } = req.body;

    const existing = await Doctor.findOne({ email });
    if (existing) {
      return res.json({ success: false, message: "Email already registered" });
    }

    const doctor = await Doctor.create({
      name,
      specialization,
      email,
      password,
      phone,
      photo,
    });

    res.json({ success: true, message: "Signup successful", doctor });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error: " + err.message });
  }
});

/* ======================================================
   🔑 Doctor Login
====================================================== */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await Doctor.findOne({ email });

    if (!doctor || doctor.password !== password) {
      return res.json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: doctor._id },
      process.env.JWT_SECRET || "supersecretkey123"
    );

    res.json({ success: true, token, doctor });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Login failed: " + err.message });
  }
});

/* ======================================================
   👨‍⚕️ Get Doctor Profile
====================================================== */
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.json({ success: false, message: "No token provided" });

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "supersecretkey123"
    );
    const doctor = await Doctor.findById(decoded.id);
    if (!doctor) return res.json({ success: false, message: "Doctor not found" });

    res.json({ success: true, doctor });
  } catch (err) {
    res
      .status(401)
      .json({ success: false, message: "Invalid token or server error" });
  }
});

/* ======================================================
   📋 Get Doctor’s Appointments (with queue order)
====================================================== */
router.get("/appointments", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.json({ success: false, message: "No token provided" });

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "supersecretkey123"
    );

    const appointments = await Appointment.find({ doctorId: decoded.id })
      .sort({ date: 1, slot: 1 });

    res.json({ success: true, appointments });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to load appointments" });
  }
});

/* ======================================================
   👁️ View Patient Details + Their Records
====================================================== */
router.get("/patient/:appointmentId", async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId);
    if (!appointment)
      return res.json({ success: false, message: "Appointment not found" });

    const patient = await Patient.findById(appointment.patientId);
    const records = await Record.find({
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
    }).sort({ createdAt: -1 });

    res.json({ success: true, patient, records });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching patient details: " + err.message,
    });
  }
});

/* ======================================================
   💾 Add Record (Prescription / Notes / X-Ray)
====================================================== */
router.post("/addRecord", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.json({ success: false, message: "No token provided" });

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "supersecretkey123"
    );
    const { appointmentId, notes, xray } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment)
      return res.json({ success: false, message: "Appointment not found" });

    const record = await Record.create({
      doctorId: decoded.id,
      doctorName: appointment.doctorName,
      patientId: appointment.patientId,
      patientName: appointment.patientName,
      notes,
      xray,
    });

    res.json({ success: true, message: "Record added successfully", record });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error saving record: " + err.message,
    });
  }
});

module.exports = router;
