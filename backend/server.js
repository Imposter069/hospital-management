require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// ✅ Import Routes
const doctorRoutes = require("./routes/doctorRoutes");
const patientRoutes = require("./routes/patientRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const recordRoutes = require("./routes/recordRoutes");

const app = express();

// ✅ Enable CORS for all origins (works even with local HTML files)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Allow JSON requests (including Base64 images)
app.use(express.json({ limit: "10mb" }));

// ✅ Connect to MongoDB
connectDB(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hospital");

// ✅ ROUTES
app.use("/doctor", doctorRoutes);
app.use("/patient", patientRoutes);
app.use("/appointment", appointmentRoutes);
app.use("/record", recordRoutes);

// ✅ Root route (for quick check)
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🏥 Hospital Management Backend is running perfectly!",
  });
});

// ✅ Handle 404 (Unknown Routes)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ✅ Global error handler (safe fallback)
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
