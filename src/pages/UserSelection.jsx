import React from "react";
import { useNavigate } from "react-router-dom";

const UserSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 flex items-center justify-center relative overflow-hidden px-6">
      {/* Floating Orbs */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-gradient-to-br from-gray-100 to-gray-300 opacity-20 blur-3xl rounded-full z-0" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-gradient-to-br from-gray-400 to-gray-600 opacity-25 blur-3xl rounded-full z-0" />

      {/* Glassmorphism Card */}
      <div className="z-10 backdrop-blur-2xl bg-white/20 shadow-xl border border-white/10 rounded-3xl px-10 py-16 text-center max-w-2xl w-full animate-fade-in-scale animate-slow-float">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 animate-slide-in-left animate-float">
          Select Your Role
        </h1>
        <p className="mt-4 text-lg text-gray-200 font-light animate-slide-in-right animate-float">
          Choose your portal to proceed
        </p>

        {/* Role Buttons */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-delay">
          <button
            onClick={() => navigate("/login?role=student")}
            className="px-6 py-4 bg-white/20 text-gray-900 font-semibold backdrop-blur-lg border border-white/10 rounded-xl hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl animate-float"
          >
            🎓 Student
          </button>

          <button
            onClick={() => navigate("/login?role=donor")}
            className="px-6 py-4 bg-white/20 text-gray-900 font-semibold backdrop-blur-lg border border-white/10 rounded-xl hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl animate-float"
          >
            💰 Donor
          </button>

          <button
            onClick={() => navigate("/login?role=faculty")}
            className="px-6 py-4 bg-white/20 text-gray-900 font-semibold backdrop-blur-lg border border-white/10 rounded-xl hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl animate-float"
          >
            🧑‍🏫 Faculty
          </button>
          {/* Back Button */}
<div className="mt-12 flex justify-center animate-fade-in-delay">
  <button
    onClick={() => navigate("/")}
    className="px-5 py-2 text-sm text-gray-700 font-medium bg-white/20 backdrop-blur-md border border-white/20 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl animate-float"
  >
    ⬅ Back to Home
  </button>
</div>

        </div>
      </div>
    </div>
  );
};

export default UserSelection;
