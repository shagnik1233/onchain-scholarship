import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractABI from "../abi/ScholarshipSystem.json";
import { useNavigate } from "react-router-dom";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const StudentDashboard = () => {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [profile, setProfile] = useState({});
  const [totalPool, setTotalPool] = useState("0");
  const [teacherInfo, setTeacherInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) return alert("Please install MetaMask");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);

      const studentAddresses = await contractInstance.getAllStudents();
      const isStudent = studentAddresses.map(a => a.toLowerCase()).includes(addr.toLowerCase());

      if (!isStudent) {
        alert("Access Denied. You are not registered as a student.");
        navigate("/login");
        return;
      }

      const [name, id, gpa, attendance, claimed] = await contractInstance.getStudent(addr);
      const contractBalance = await contractInstance.getTotalBalance();
      const [facultyName, facultyId, facultyAddress] = await contractInstance.getTeacher();

      setAccount(addr);
      setContract(contractInstance);
      setProfile({ name, id, gpa, attendance, claimed });
      setTotalPool(ethers.formatEther(contractBalance));
      setTeacherInfo({ facultyName, facultyId, facultyAddress });
    };

    init();
  }, []);

  const handleClaim = async () => {
    setIsLoading(true);
    try {
      const tx = await contract.claimScholarship();
      await tx.wait();

      const [_, __, ___, ____, claimed] = await contract.getStudent(account);
      const funds = await contract.getTotalBalance();

      setProfile((prev) => ({ ...prev, claimed }));
      setTotalPool(ethers.formatEther(funds));

      alert("✅ Scholarship successfully claimed!");
    } catch (err) {
      console.error("Claim failed:", err);
      alert("❌ Failed to claim: " + (err.reason || err.message));
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-8">
      {/* Back */}
      <button
        onClick={() => navigate("/login")}
        className="mb-6 px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-lg shadow hover:scale-105 transition-all"
      >
        ← Back
      </button>

      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2">🎓 Student Dashboard</h1>
      <p className="mb-6 text-gray-700 font-mono">Wallet: {account}</p>

      {/* Profile Card */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
        <h2 className="text-xl font-semibold mb-4">🧾 Profile Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800">
          <p><strong>👤 Name:</strong> {profile.name}</p>
          <p><strong>🆔 ID:</strong> {profile.id}</p>
          <p>
            <strong>📊 GPA:</strong> 
            <span className={`ml-2 font-semibold ${profile.gpa >= 8 ? "text-green-600" : "text-red-500"}`}>
              {profile.gpa}
            </span>
          </p>
          <p>
            <strong>📅 Attendance:</strong> 
            <span className={`ml-2 font-semibold ${profile.attendance >= 75 ? "text-green-600" : "text-red-500"}`}>
              {profile.attendance}%
            </span>
          </p>
          <p><strong>💰 Scholarship Claimed:</strong> {profile.claimed ? "✅ Yes (5 ETH)" : "❌ Not yet"}</p>
        </div>

        {profile.gpa < 8 && (
          <p className="mt-2 text-sm text-red-500">
            ⚠️ GPA is low. Improve academic performance to meet requirements.
          </p>
        )}
        {profile.attendance < 75 && (
          <p className="text-sm text-red-500">
            ⚠️ Low attendance. Minimum 75% expected.
          </p>
        )}

        <button
          onClick={handleClaim}
          disabled={profile.claimed || isLoading}
          className={`mt-6 px-6 py-2 rounded-lg text-white transition ${
            profile.claimed
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? "Processing..." : profile.claimed ? "Already Claimed" : "Claim 5 ETH"}
        </button>
      </div>

      {/* Scholarship Contract Overview */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
        <h2 className="text-xl font-semibold mb-4">💼 Scholarship Fund Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800">
          <p><strong>💳 Total ETH Remaining:</strong> {totalPool} ETH</p>
          <p><strong>💸 You Have Claimed:</strong> {profile.claimed ? "5.0 ETH" : "0 ETH"}</p>
        </div>
      </div>

      {/* Faculty Info */}
      <div className="bg-white p-6 rounded-xl shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl">
        <h2 className="text-xl font-semibold mb-4">👨‍🏫 Faculty Information</h2>
        <p><strong>Name:</strong> {teacherInfo.facultyName}</p>
        <p><strong>ID:</strong> {teacherInfo.facultyId}</p>
        <p><strong>Wallet:</strong> <span className="font-mono">{teacherInfo.facultyAddress}</span></p>
      </div>
    </div>
  );
};

export default StudentDashboard;
