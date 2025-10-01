const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const doctorRoutes = require("./routes/doctorRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://127.0.0.1:27017/hospitalDB")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.use("/doctor", doctorRoutes);

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
