import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 flex items-center justify-center relative overflow-hidden px-6">
      {/* Floating Orbs */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-gradient-to-br from-gray-100 to-gray-300 opacity-20 blur-3xl rounded-full z-0" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-gradient-to-br from-gray-400 to-gray-600 opacity-25 blur-3xl rounded-full z-0" />

      {/* Animated Glass Card */}
      <div className="z-10 backdrop-blur-2xl bg-white/20 shadow-xl border border-white/10 rounded-3xl px-10 py-16 text-center max-w-2xl w-full animate-fade-in-scale animate-slow-float">
        
        {/* Heading with slide, float, and glow */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight animate-slide-in-left animate-float animate-pulse-glow">
          NextGen Scholar Network
          
        </h1>

        {/* Subheading with smooth combo */}
        <p className="mt-6 text-lg md:text-xl text-gray-200 font-light animate-slide-in-right animate-float animate-fade-in-delay">
          The Network for the Now & Next
        </p>

        {/* CTA Button */}
        <button
          
          onClick={() => navigate("/user-selection")}
          className="mt-10 px-8 py-3 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-float animate-fade-in-delay"
        >
           Launch Portal
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
