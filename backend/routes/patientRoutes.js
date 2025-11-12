const express = require("express");
const jwt = require("jsonwebtoken");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const Record = require("../models/Record");

const router = express.Router();

/* ======================================================
   🧾 PATIENT SIGNUP
====================================================== */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, age, gender, photo } = req.body;

    const existing = await Patient.findOne({ email });
    if (existing)
      return res.json({ success: false, message: "Email already registered" });

    const patient = await Patient.create({
      name,
      email,
      password,
      age,
      gender,
      photo,
    });

    res.json({ success: true, message: "Signup successful", patient });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Signup error: " + err.message });
  }
});

/* ======================================================
   🔑 PATIENT LOGIN
====================================================== */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const patient = await Patient.findOne({ email });

    if (!patient || patient.password !== password)
      return res.json({ success: false, message: "Invalid email or password" });

    const token = jwt.sign(
      { id: patient._id },
      process.env.JWT_SECRET || "supersecretkey123"
    );

    res.json({ success: true, token, patient });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Login error: " + err.message });
  }
});

/* ======================================================
   👤 PATIENT PROFILE
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
    const patient = await Patient.findById(decoded.id);

    if (!patient)
      return res.json({ success: false, message: "Patient not found" });

    res.json({ success: true, patient });
  } catch (err) {
    res
      .status(401)
      .json({ success: false, message: "Invalid token or server error" });
  }
});

/* ======================================================
   🩺 GET ALL DOCTORS
====================================================== */
router.get("/doctors", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json({ success: true, doctors });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch doctors" });
  }
});

/* ======================================================
   📅 BOOK APPOINTMENT (With Queue + Disease)
====================================================== */
router.post("/book", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.json({ success: false, message: "No token provided" });

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "supersecretkey123"
    );
    const { doctor, date, disease } = req.body;

    const doc = await Doctor.findOne({ name: doctor });
    const patient = await Patient.findById(decoded.id);

    if (!doc || !patient)
      return res.json({ success: false, message: "Invalid doctor or patient" });

    // Calculate queue number (slot)
    const existingCount = await Appointment.countDocuments({
      doctorId: doc._id,
      date,
    });
    const slot = existingCount + 1;

    const appointment = await Appointment.create({
      doctorId: doc._id,
      doctorName: doc.name,
      patientId: patient._id,
      patientName: patient.name,
      date,
      disease: disease || "",
      slot,
    });

    res.json({
      success: true,
      message: `Appointment booked successfully! Your queue number is ${slot}.`,
      appointment,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Booking error: " + err.message });
  }
});

/* ======================================================
   📄 GET PATIENT’S MEDICAL RECORDS
====================================================== */
router.get("/records", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.json({ success: false, message: "No token provided" });

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "supersecretkey123"
    );
    const records = await Record.find({ patientId: decoded.id }).sort({
      createdAt: -1,
    });

    res.json({ success: true, records });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching records: " + err.message });
  }
});

/* ======================================================
   🧾 GET PATIENT’S OWN APPOINTMENTS
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
    const appointments = await Appointment.find({
      patientId: decoded.id,
    }).sort({ date: 1, slot: 1 });

    res.json({ success: true, appointments });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching appointments: " + err.message,
    });
  }
});

module.exports = router;
