import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    password2: "",
  });

  const [error, setError] = useState("");

  // Input change handler
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Password match check
    if (formData.password !== formData.password2) {
      setError("Password और Confirm Password match नहीं कर रहे।");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/voters/register`,
        {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          password2: formData.password2,
          mobileNumber: formData.mobileNumber, // mobile number add करना जरूरी है
        }
      );

      console.log("✅ Registration success:", res.data);
      navigate("/login");
    } catch (err) {
      console.log("❌ Register error:", err);
      setError(
        err.response?.data?.message || "Registration failed. Try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-orange-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
          ग्राम पंचायत मतदाता पंजीकरण 🗳️
        </h2>

        {error && (
          <p className="text-red-600 bg-red-50 border border-red-300 rounded-md text-center py-2 mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="fullName"
            placeholder="पूरा नाम (Full Name)"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-500 outline-none"
            required
          />

          <input
            type="text"
            name="mobileNumber"
            placeholder="मोबाइल नंबर (Mobile Number)"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-500 outline-none"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="ईमेल पता (Email Address)"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-500 outline-none"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="पासवर्ड (Password)"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-500 outline-none"
            required
          />

          <input
            type="password"
            name="password2"
            placeholder="पासवर्ड की पुष्टि करें (Confirm Password)"
            value={formData.password2}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-500 outline-none"
            required
          />

          <button
            type="submit"
            className="w-full bg-green-700 text-white font-semibold py-2 rounded-lg hover:bg-green-800 transition"
          >
            Register Now
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-700">
          <p>
            पहले से खाता है?{" "}
            <Link
              to="/login"
              className="text-green-700 font-semibold hover:underline"
            >
              लॉगिन करें
            </Link>
          </p>
          <p className="mt-2">
            <Link
              to="/forgot-password"
              className="text-blue-600 hover:underline"
            >
              पासवर्ड भूल गए?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
