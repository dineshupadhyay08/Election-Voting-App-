import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Calendar, ChevronDown, Scan } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    idType: "",
    idNumber: "",
    phone: "",
    password: "",
    password2: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.password2) {
      setError("Password match नहीं कर रहा");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/voters/register`,
        formData
      );
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-white px-4 pt-12 pb-12">
      <div className="w-full max-w-sm md:max-w-md bg-white rounded-3xl shadow-2xl px-6 py-10 mt-6">
        {/* TITLE */}
        <div className="flex flex-col items-center mt-6 mb-8">
          <img
            src="/Register_vote_img.jpg"
            alt="Voting Logo"
            className="w-20 h-20 mb-4"
          />

          <h2 className="text-xl font-semibold">Register Now!</h2>
        </div>

        {error && (
          <p className="text-red-600 text-sm text-center mb-3">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            className="input-ui"
            required
          />

          {/* DOB */}
          <div className="relative">
            <input
              type="date"
              name="dob"
              onChange={handleChange}
              className="input-ui pr-10"
              required
            />
            <Calendar className="icon-ui" />
          </div>

          {/* Select ID */}
          <div className="relative">
            <select
              name="idType"
              onChange={handleChange}
              className="input-ui appearance-none"
              required
            >
              <option value="">Select the ID</option>
              <option value="aadhaar">Aadhaar</option>
              <option value="voter">Voter ID</option>
              <option value="pan">PAN</option>
            </select>
            <ChevronDown className="icon-ui" />
          </div>

          {/* ID Number */}
          <input
            type="text"
            name="idNumber"
            placeholder="ID No"
            onChange={handleChange}
            className="input-ui"
            required
          />

          {/* Phone */}
          <input
            type="text"
            name="phone"
            placeholder="Phone No"
            onChange={handleChange}
            className="input-ui"
            required
          />

          <p className="text-xs text-gray-500">
            Note: Please provide the phone number linked to your Aadhaar ID*
          </p>

          {/* Scan ID */}
          <button
            type="button"
            disabled
            className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-500 py-3 rounded-xl cursor-not-allowed"
          >
            Scan the ID <Scan size={18} />
          </button>

          {/* Verify */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition"
          >
            Verify
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm mt-6">
          Already Registered?{" "}
          <Link to="/login" className="text-indigo-600 font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
