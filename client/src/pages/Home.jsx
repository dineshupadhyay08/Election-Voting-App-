import React from "react";
import { FaVoteYea, FaUsers, FaChartPie } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleClick = (path) => {
    if (!token) {
      alert("कृपया पहले लॉगिन करें। Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } else {
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <section className="bg-gradient-to-r from-green-600 via-white to-orange-500 text-center py-16 shadow-md">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          ग्राम पंचायत मतदान ऐप 🗳️
        </h1>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div
          className="bg-white shadow-md rounded-xl p-6 cursor-pointer hover:bg-green-50 transition"
          onClick={() => handleClick("/live-voting")}
        >
          <FaVoteYea className="text-green-700 text-3xl mb-3" />
          <h2 className="text-xl font-semibold mb-2">Live Voting</h2>
          <p>वर्तमान चुनावों की लाइव वोटिंग स्टेटस यहाँ देखें।</p>
        </div>

        <div
          className="bg-white shadow-md rounded-xl p-6 cursor-pointer hover:bg-green-50 transition"
          onClick={() => handleClick("/candidates")}
        >
          <FaUsers className="text-green-700 text-3xl mb-3" />
          <h2 className="text-xl font-semibold mb-2">Candidates</h2>
          <p>उम्मीदवारों के विवरण यहाँ देखें।</p>
        </div>

        <div
          className="bg-white shadow-md rounded-xl p-6 cursor-pointer hover:bg-green-50 transition"
          onClick={() => handleClick("/results")}
        >
          <FaChartPie className="text-green-700 text-3xl mb-3" />
          <h2 className="text-xl font-semibold mb-2">Results</h2>
          <p>चुनाव परिणाम देखें।</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
