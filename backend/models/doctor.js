const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    specialization: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: "",
    },
    photo: {
      type: String, // Base64 or image URL
      default: "",
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

module.exports = mongoose.model("Doctor", doctorSchema);
