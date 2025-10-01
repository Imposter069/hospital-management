const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Doctor = require("./models/Doctor");
const Appointment = require("./models/Appointment");

const router = express.Router();

// Doctor Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, specialization, email, password, availability } = req.body;

    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) return res.json({ success: false, message: "Doctor already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = new Doctor({
      name,
      specialization,
      email: Unique,
      password: hashedPassword,
      availability
    });

    await doctor.save();
    res.json({ success: true, message: "Doctor registered successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Doctor Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await Doctor.findOne({ email });
    if (!doctor) return res.json({ success: false, message: "Doctor not found" });

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) return res.json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: doctor._id }, "secretKey", { expiresIn: "1h" });

    res.json({ success: true, token, doctor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get Doctor Appointments
router.get("/:doctorId/appointments", async (req, res) => {
  try {
    const { doctorId } = req.params;
    const appointments = await Appointment.find({ doctor_id: doctorId });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
