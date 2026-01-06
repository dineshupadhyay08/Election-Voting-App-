import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaVoteYea,
  FaUserCheck,
  FaShieldAlt,
  FaChartBar,
} from "react-icons/fa";

const HomePage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const go = (path) => {
    if (!token) {
      alert("पहले लॉगिन करें");
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* 🔹 HERO SECTION (FIGMA STYLE) */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Digital Voting <br />
            <span className="text-green-600">Made Simple & Secure</span>
          </h1>

          <p className="mt-5 text-gray-600 max-w-md">
            Vote digitally with transparency and security. Designed for Gram
            Panchayat & local elections.
          </p>

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => go("/live-voting")}
              className="bg-green-600 text-white px-7 py-3 rounded-lg font-medium hover:bg-green-700"
            >
              Start Voting
            </button>

            <button
              onClick={() => navigate("/results")}
              className="border border-gray-300 px-7 py-3 rounded-lg font-medium hover:bg-gray-100"
            >
              View Results
            </button>
          </div>
        </div>

        {/* Right (Illustration Placeholder like Figma) */}
        <div className="lg:flex justify-center">
          <div className="w-full max-w-sm h-72 bg-white rounded-2xl shadow-md overflow-hidden">
            <img
              src="/Vote.jpg"
              alt="Digital Voting Illustration"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </section>

      {/* 🔹 ACTIVE ELECTIONS */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold mb-6">Active Elections</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {["Gram Pradhan", "Ward Member", "Local Committee"].map((item, i) => (
            <div
              key={i}
              onClick={() => go("/live-voting")}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg cursor-pointer transition"
            >
              <h3 className="font-semibold text-lg">{item}</h3>
              <p className="text-sm text-gray-500 mt-1">
                Status: <span className="text-green-600">Live</span>
              </p>

              <button className="mt-4 text-green-600 font-medium">
                Vote Now →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 🔹 TRUST / FEATURES (FIGMA PRODUCT SECTION) */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-semibold text-center mb-12">
            Why Use Digital Voting?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <div>
              <FaShieldAlt className="mx-auto text-3xl text-green-600" />
              <h4 className="mt-4 font-semibold">Secure System</h4>
              <p className="text-gray-500 text-sm mt-2">
                Encrypted and tamper-proof voting.
              </p>
            </div>

            <div>
              <FaUserCheck className="mx-auto text-3xl text-green-600" />
              <h4 className="mt-4 font-semibold">Verified Voters</h4>
              <p className="text-gray-500 text-sm mt-2">
                One voter, one vote policy.
              </p>
            </div>

            <div>
              <FaChartBar className="mx-auto text-3xl text-green-600" />
              <h4 className="mt-4 font-semibold">Live Results</h4>
              <p className="text-gray-500 text-sm mt-2">
                Transparent result tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🔹 FOOTER CTA */}
      <section className="py-14 text-center">
        <h3 className="text-xl font-semibold">
          Your Vote. Your Right. Your Power.
        </h3>
      </section>
    </div>
  );
};

export default HomePage;
