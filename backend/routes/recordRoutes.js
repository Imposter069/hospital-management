const express = require("express");
const jwt = require("jsonwebtoken");
const Record = require("../models/Record");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");

const router = express.Router();

/* ======================================================
   💾 ADD NEW MEDICAL RECORD (Doctor)
====================================================== */
router.post("/add", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.json({ success: false, message: "No token provided" });

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "supersecretkey123"
    );
    const { patientId, notes, xray } = req.body;

    const doctor = await Doctor.findById(decoded.id);
    const patient = await Patient.findById(patientId);

    if (!doctor || !patient)
      return res.json({
        success: false,
        message: "Doctor or patient not found",
      });

    const record = await Record.create({
      doctorId: doctor._id,
      doctorName: doctor.name,
      patientId: patient._id,
      patientName: patient.name,
      notes: notes || "No notes provided",
      xray: xray || "",
    });

    res.json({
      success: true,
      message: "Record added successfully!",
      record,
    });
  } catch (err) {
    console.error("Error adding record:", err);
    res.status(500).json({
      success: false,
      message: "Server error while adding record: " + err.message,
    });
  }
});

/* ======================================================
   👁️ VIEW ALL RECORDS FOR A SPECIFIC PATIENT (by Doctor)
====================================================== */
router.get("/patient/:id", async (req, res) => {
  try {
    const records = await Record.find({ patientId: req.params.id })
      .populate("doctorId", "name specialization")
      .sort({ createdAt: -1 });

    if (!records.length)
      return res.json({ success: false, message: "No records found" });

    res.json({ success: true, records });
  } catch (err) {
    console.error("Error fetching patient records:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch patient records: " + err.message,
    });
  }
});

/* ======================================================
   👨‍⚕️ VIEW ALL RECORDS BY LOGGED-IN DOCTOR
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

    const records = await Record.find({ doctorId: decoded.id })
      .populate("patientId", "name age gender")
      .sort({ createdAt: -1 });

    res.json({ success: true, records });
  } catch (err) {
    console.error("Error fetching doctor records:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching doctor records: " + err.message,
    });
  }
});

/* ======================================================
   🧍 VIEW ALL RECORDS FOR LOGGED-IN PATIENT
====================================================== */
router.get("/mypatient", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.json({ success: false, message: "No token provided" });

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "supersecretkey123"
    );

    const records = await Record.find({ patientId: decoded.id })
      .populate("doctorId", "name specialization")
      .sort({ createdAt: -1 });

    res.json({ success: true, records });
  } catch (err) {
    console.error("Error fetching patient records:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching patient records: " + err.message,
    });
  }
});

/* ======================================================
   ❌ DELETE RECORD (Optional)
====================================================== */
router.delete("/delete/:id", async (req, res) => {
  try {
    const record = await Record.findByIdAndDelete(req.params.id);
    if (!record)
      return res.json({ success: false, message: "Record not found" });

    res.json({ success: true, message: "Record deleted successfully" });
  } catch (err) {
    console.error("Error deleting record:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete record: " + err.message,
    });
  }
});

module.exports = router;
