const express = require("express");
const jwt = require("jsonwebtoken");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");

const router = express.Router();

/* ======================================================
   📅 CREATE NEW APPOINTMENT (Queue + Disease)
====================================================== */
router.post("/create", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.json({ success: false, message: "No token provided" });

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "supersecretkey123"
    );
    const { doctorId, date, disease } = req.body;

    const patient = await Patient.findById(decoded.id);
    const doctor = await Doctor.findById(doctorId);

    if (!doctor || !patient)
      return res.json({
        success: false,
        message: "Invalid doctor or patient",
      });

    // ✅ Queue system: determine next slot number for that doctor and date
    const existingCount = await Appointment.countDocuments({
      doctorId: doctor._id,
      date,
    });
    const slot = existingCount + 1;

    // ✅ Create new appointment
    const appointment = await Appointment.create({
      doctorId: doctor._id,
      doctorName: doctor.name,
      patientId: patient._id,
      patientName: patient.name,
      date,
      disease: disease || "",
      slot,
    });

    res.json({
      success: true,
      message: `Appointment booked successfully! Queue number: ${slot}`,
      appointment,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error: " + err.message,
    });
  }
});

/* ======================================================
   📋 GET ALL APPOINTMENTS (Admin / Debug)
====================================================== */
router.get("/all", async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("doctorId", "name specialization")
      .populate("patientId", "name email")
      .sort({ date: 1, slot: 1 });

    res.json({ success: true, appointments });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch appointments" });
  }
});

/* ======================================================
   👨‍⚕️ GET DOCTOR’S APPOINTMENTS
====================================================== */
router.get("/doctor", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.json({ success: false, message: "No token provided" });

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "supersecretkey123"
    );

    const appointments = await Appointment.find({
      doctorId: decoded.id,
    }).sort({ date: 1, slot: 1 });

    res.json({ success: true, appointments });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching doctor appointments: " + err.message,
    });
  }
});

/* ======================================================
   🧍‍♀️ GET PATIENT’S APPOINTMENTS
====================================================== */
router.get("/patient", async (req, res) => {
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
      message: "Error fetching patient appointments: " + err.message,
    });
  }
});

/* ======================================================
   ❌ DELETE APPOINTMENT
====================================================== */
router.delete("/delete/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment)
      return res.json({ success: false, message: "Appointment not found" });

    res.json({ success: true, message: "Appointment deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to delete appointment" });
  }
});

module.exports = router;
