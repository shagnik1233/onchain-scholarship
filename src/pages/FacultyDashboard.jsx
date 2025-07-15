import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractABI from "../abi/ScholarshipSystem.json";
import { useNavigate } from "react-router-dom";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const FacultyDashboard = () => {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [students, setStudents] = useState([]);
  const [donors, setDonors] = useState([]);
  const [balance, setBalance] = useState(0);
  const [teacher, setTeacher] = useState("");

  const [updateData, setUpdateData] = useState({ address: "", gpa: "", attendance: "" });

  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) return alert("Please install MetaMask");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);

      const [tName, tId, tAddress] = await contract.getTeacher();
      if (addr.toLowerCase() !== tAddress.toLowerCase()) {
        alert("Access Denied. Not a teacher!");
        navigate("/login");
        return;
      }

      const studentAddrs = await contract.getAllStudents();
      const detailedStudents = await Promise.all(
        studentAddrs.map(async (addr) => {
          const [name, id, gpa, attendance, claimed] = await contract.getStudent(addr);
          return { address: addr, name, id, gpa, attendance, claimed };
        })
      );

      const [donorAddrs, donorNames] = await contract.getAllDonors();
      const donorDetails = await Promise.all(
        donorAddrs.map(async (addr, i) => {
          const [, amount] = await contract.getDonor(addr);
          return {
            address: addr,
            name: donorNames[i],
            amount: ethers.formatEther(amount)
          };
        })
      );

      const totalBalance = await contract.getTotalBalance();

      setContract(contract);
      setAccount(addr);
      setStudents(detailedStudents);
      setDonors(donorDetails);
      setBalance(Number(ethers.formatEther(totalBalance)));
      setTeacher(`${tName} (${tId})`);
    };

    init();
  }, []);

  const handleUpdateScores = async () => {
    const { address, gpa, attendance } = updateData;
    if (!address || !gpa || !attendance) return alert("Fill all fields");

    try {
      const tx = await contract.updateScores(address, parseInt(gpa), parseInt(attendance));
      await tx.wait();
      alert("✅ Scores updated!");
      window.location.reload();
    } catch (err) {
      console.error("Update scores failed:", err);
      alert("❌ Failed to update scores.");
    }
  };

  const totalDisbursed = students.filter((s) => s.claimed).length * 5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-300 p-8">
      <button
        onClick={() => navigate("/login")}
        className="mb-6 px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-lg shadow hover:scale-105"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-2">🎓 Faculty Dashboard</h1>
      <p className="mb-6 text-gray-700">Logged in as: {teacher}</p>

      {/* 🔁 Contract Info */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow text-center transition duration-300 hover:-translate-y-1 hover:shadow-xl">
          <p className="text-gray-500">💰 Total ETH in Contract</p>
          <p className="text-xl font-bold text-green-600">{balance.toFixed(4)} ETH</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center transition duration-300 hover:-translate-y-1 hover:shadow-xl">
          <p className="text-gray-500">📤 Disbursed (5 ETH/student)</p>
          <p className="text-xl font-bold text-red-600">{totalDisbursed.toFixed(2)} ETH</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center transition duration-300 hover:-translate-y-1 hover:shadow-xl">
          <p className="text-gray-500">👨‍🎓 Total Students</p>
          <p className="text-xl font-bold text-indigo-600">{students.length}</p>
        </div>
      </div>

      {/* ✏️ Update Scores */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
        <h2 className="text-xl font-semibold mb-4">📊 Update Student Scores</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Wallet Address"
            value={updateData.address}
            onChange={(e) => setUpdateData({ ...updateData, address: e.target.value })}
            className="px-4 py-2 border rounded w-full"
          />
          <input
            type="number"
            placeholder="GPA"
            value={updateData.gpa}
            onChange={(e) => setUpdateData({ ...updateData, gpa: e.target.value })}
            className="px-4 py-2 border rounded w-full"
          />
          <input
            type="number"
            placeholder="Attendance"
            value={updateData.attendance}
            onChange={(e) => setUpdateData({ ...updateData, attendance: e.target.value })}
            className="px-4 py-2 border rounded w-full"
          />
        </div>
        <button
          onClick={handleUpdateScores}
          className="mt-4 bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
        >
          Update Scores
        </button>
      </div>

      {/* 📋 Student Table */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-12 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
        <h2 className="text-xl font-semibold mb-4">📚 Registered Students</h2>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">ID</th>
              <th className="p-2">Address</th>
              <th className="p-2">GPA</th>
              <th className="p-2">Attendance</th>
              <th className="p-2">Claimed</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-2">{s.name}</td>
                <td className="p-2">{s.id}</td>
                <td className="p-2 font-mono text-xs">{s.address}</td>
                <td className="p-2">{s.gpa}</td>
                <td className="p-2">{s.attendance}%</td>
                <td className="p-2">{s.claimed ? "✅" : "❌"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🧑‍💼 Donors */}
      <div className="bg-white p-6 rounded-xl shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl">
        <h2 className="text-xl font-semibold mb-4">💎 Donor List</h2>
        {donors.length === 0 ? (
          <p className="text-gray-500">No donations yet.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Address</th>
                <th className="p-2">Amount (ETH)</th>
              </tr>
            </thead>
            <tbody>
              {donors.map((d, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2">{d.name}</td>
                  <td className="p-2 font-mono text-xs">{d.address}</td>
                  <td className="p-2">{Number(d.amount).toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default FacultyDashboard;
