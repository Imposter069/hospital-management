import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DoctorDashboard.css";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    // Later we'll connect this with MongoDB + backend API
    alert("Password changed successfully!");
    navigate("/doctor/dashboard");
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Change Password</h1>
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
          <h2>Update Password</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="input-field"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input-field"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field"
            />
            <button onClick={handleChangePassword}>Save Changes</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ChangePassword;
