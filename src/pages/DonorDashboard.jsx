import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractABI from "../abi/ScholarshipSystem.json";
import { useNavigate } from "react-router-dom";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const USD_TO_INR = 86;

const DonorDashboard = () => {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [amountETH, setAmountETH] = useState("");
  const [totalPool, setTotalPool] = useState("0");
  const [donorData, setDonorData] = useState({ name: "", amount: "0" });
  const [donorList, setDonorList] = useState([]);
  const [ethPriceUSD, setEthPriceUSD] = useState(2980);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd")
      .then((res) => res.json())
      .then((data) => {
        if (data?.ethereum?.usd) setEthPriceUSD(data.ethereum.usd);
      })
      .catch(() => console.warn("Failed to fetch ETH price"));
  }, []);

  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) return alert("Please install MetaMask");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);

      const totalFunds = await contractInstance.getTotalBalance();
      const [donorName, donorAmount] = await contractInstance.getDonor(addr);
      const [addresses, names] = await contractInstance.getAllDonors();

      const list = addresses.map((a, i) => ({ address: a, name: names[i] }));

      setAccount(addr);
      setContract(contractInstance);
      setTotalPool(ethers.formatEther(totalFunds));
      setDonorData({ name: donorName, amount: ethers.formatEther(donorAmount) });
      setDonorList(list);
    };

    init();
  }, []);

  const handleDonate = async () => {
    if (!donorName || !amountETH || isNaN(amountETH)) {
      alert("Please enter a valid name and amount.");
      return;
    }

    setIsLoading(true);
    try {
      const tx = await contract.donate(donorName, {
        value: ethers.parseEther(amountETH),
      });
      await tx.wait();

      const totalFunds = await contract.getTotalBalance();
      const [name, amt] = await contract.getDonor(account);
      const [addresses, names] = await contract.getAllDonors();

      const list = addresses.map((a, i) => ({ address: a, name: names[i] }));

      setTotalPool(ethers.formatEther(totalFunds));
      setDonorData({ name, amount: ethers.formatEther(amt) });
      setDonorList(list);
      setAmountETH("");
      setDonorName("");

      alert("✅ Donation successful!");
    } catch (err) {
      console.error("Donation failed:", err);
      alert("❌ Donation failed");
    }
    setIsLoading(false);
  };

  const formatINR = (eth) =>
    (eth * ethPriceUSD * USD_TO_INR).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-200 p-8 relative">
      {/* Floating Background Effects */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-gradient-to-br from-yellow-300 to-orange-500 opacity-20 blur-3xl rounded-full z-0" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-gradient-to-br from-orange-400 to-red-400 opacity-25 blur-3xl rounded-full z-0" />

      {/* Back Button */}
      <button
        onClick={() => navigate("/login")}
        className="mb-6 px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-lg shadow hover:scale-105 transition-all relative z-10"
      >
        ← Back
      </button>

      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2 relative z-10">💰 Donor Dashboard</h1>
      <p className="mb-6 text-gray-700 font-mono relative z-10">Wallet: {account}</p>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-8 relative z-10">
        <div className="bg-white p-5 rounded-xl shadow-md hover:-translate-y-1 transition hover:shadow-xl">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">🎯 Total Fund Pool</h2>
          <p className="text-xl font-bold text-green-600">Ξ {totalPool}</p>
          <p className="text-sm text-gray-500">≈ {formatINR(parseFloat(totalPool || 0))}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-md hover:-translate-y-1 transition hover:shadow-xl">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">🧾 Your Donations</h2>
          <p className="text-xl font-bold text-indigo-600">Ξ {donorData.amount}</p>
          <p className="text-sm text-gray-500">≈ {formatINR(parseFloat(donorData.amount || 0))}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-md hover:-translate-y-1 transition hover:shadow-xl">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">📢 Name</h2>
          <p className="text-xl font-bold text-gray-700">{donorData.name || "Not Set"}</p>
        </div>
      </div>

      {/* Floating Donation Box */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8 relative z-10 animate-float">
        <h2 className="text-xl font-semibold mb-4">💸 Make a Donation</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Your Name"
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            className="px-4 py-2 border rounded"
          />
          <input
            type="number"
            placeholder="Amount in ETH"
            value={amountETH}
            onChange={(e) => setAmountETH(e.target.value)}
            className="px-4 py-2 border rounded"
          />
          <button
            onClick={handleDonate}
            disabled={isLoading}
            className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 transition"
          >
            {isLoading ? "Processing..." : "Donate"}
          </button>
        </div>
        {amountETH && (
          <p className="mt-2 text-sm text-gray-600">
            ≈ {formatINR(parseFloat(amountETH || 0))} for {amountETH} ETH
          </p>
        )}
      </div>

      {/* Floating Donor List */}
      <div className="bg-white p-6 rounded-xl shadow-md relative z-10 animate-float">
        <h2 className="text-xl font-semibold mb-4">📋 All Donors</h2>
        {donorList.length === 0 ? (
          <p className="text-gray-500">No donors yet.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Address</th>
              </tr>
            </thead>
            <tbody>
              {donorList.map((d, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2">{d.name}</td>
                  <td className="p-2 font-mono text-xs">{d.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DonorDashboard;
