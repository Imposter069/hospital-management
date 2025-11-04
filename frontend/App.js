import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DoctorDashboard from "./DoctorDashboard";
import DoctorProfile from "./DoctorProfile";
import ChangePassword from "./ChangePassword";
import DoctorAppointments from "./DoctorAppointments"; // for later

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/profile" element={<DoctorProfile />} />
        <Route path="/doctor/change-password" element={<ChangePassword />} />
        <Route path="/doctor/appointments" element={<DoctorAppointments />} />
      </Routes>
    </Router>
  );
}

export default App;
