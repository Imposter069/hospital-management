import React from "react";
import { useNavigate } from "react-router-dom";
import "./DoctorDashboard.css";

const DoctorProfile = () => {
  const navigate = useNavigate();

  const doctor = {
    name: "Dr. John Doe",
    specialization: "Cardiologist",
    email: "johndoe@gmail.com",
    phone: "+91 9876543210",
    experience: "10 years",
    qualifications: "MBBS, MD (Cardiology)",
    availability: "Mon - Fri, 10:00 AM - 5:00 PM",
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Doctor Profile</h1>
        <button
          style={{
            backgroundColor: "white",
            color: "#007bff",
            padding: "8px 16px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => navigate("/doctor/dashboard")}
        >
          ← Back
        </button>
      </header>

      <main className="dashboard-main">
        <section className="doctor-info">
          <h2>Profile Details</h2>
          <p><strong>Name:</strong> {doctor.name}</p>
          <p><strong>Specialization:</strong> {doctor.specialization}</p>
          <p><strong>Email:</strong> {doctor.email}</p>
          <p><strong>Phone:</strong> {doctor.phone}</p>
          <p><strong>Experience:</strong> {doctor.experience}</p>
          <p><strong>Qualifications:</strong> {doctor.qualifications}</p>
          <p><strong>Availability:</strong> {doctor.availability}</p>
        </section>
      </main>
    </div>
  );
};

export default DoctorProfile;
