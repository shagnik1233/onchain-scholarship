import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import UserSelection from "./pages/UserSelection";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";
import DonorDashboard from "./pages/DonorDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/user-selection" element={<UserSelection />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard/student" element={<StudentDashboard />} />
        <Route path="/dashboard/donor" element={<DonorDashboard />} />
        <Route path="/dashboard/faculty" element={<FacultyDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
