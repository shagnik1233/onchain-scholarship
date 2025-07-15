import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ethers } from "ethers";
import contractABI from "../abi/ScholarshipSystem.json";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // ✅ Update with your deployed contract address if needed

const LoginPage = () => {
  const [account, setAccount] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const role = new URLSearchParams(location.search).get("role");

  const connectWallet = async () => {
  try {
    if (!window.ethereum) {
      return alert("Please install MetaMask");
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const userAddress = accounts[0];
    setAccount(userAddress);
    console.log("🧠 User Address:", userAddress);
    console.log("🎯 Role Selected:", role);

    const provider = new ethers.BrowserProvider(window.ethereum); // ethers v6
    const signer = await provider.getSigner(); // ✅ await this!
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);

    // ✅ Fetch roles data
    const teacher = await contract.getTeacher(); // [name, id, address]
    const allStudents = await contract.getAllStudents(); // address[]
    const donorData = await contract.getAllDonors(); // [address[], name[]]
    const donorAddresses = donorData[0];

    console.log("📚 Teacher Address:", teacher[2]);
    console.log("🧑‍🎓 Students:", allStudents);
    console.log("💰 Donor Addresses:", donorAddresses);

    // ✅ Check login role
    if (role === "faculty") {
      if (userAddress.toLowerCase() === teacher[2].toLowerCase()) {
        navigate("/dashboard/faculty");
      } else {
        setError("You are not registered as faculty.");
      }
    } else if (role === "student") {
      const isStudent = allStudents.some(
        (addr) => addr.toLowerCase() === userAddress.toLowerCase()
      );
      if (isStudent) {
        navigate("/dashboard/student");
      } else {
        setError("You are not registered as student.");
      }
    } else if (role === "donor") {
      const isDonor = donorAddresses.some(
        (addr) => addr.toLowerCase() === userAddress.toLowerCase()
      );
      if (isDonor) {
        navigate("/dashboard/donor");
      } else {
        setError("You are not registered as donor.");
      }
    } else {
      setError("Invalid role selected.");
    }

  } catch (err) {
    console.error("❌ Error connecting wallet:", err);
    setError("Error connecting wallet");
  }
};


  return (
    
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 ">
      <h1 className="text-3xl font-bold mb-6">Login as {role}</h1>
      <button
        onClick={connectWallet}
        className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
      >
        Connect Wallet
      </button>
      {account && (
        <p className="mt-4 text-sm text-gray-700">Connected: {account}</p>
      )}
      {error && <p className="mt-2 text-red-500">{error}</p>}
<button
  onClick={() => navigate("/user-selection")}
  className="mt-10 px-5 py-2 text-sm text-gray-700 font-medium bg-white/20 backdrop-blur-md border border-white/20 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl animate-float"
>
  ⬅ Back to Role Selection
</button>


    </div>
  );
};

export default LoginPage;
