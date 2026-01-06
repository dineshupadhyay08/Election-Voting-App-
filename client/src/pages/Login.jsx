import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // API call here
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Welcome Back
        </h2>
        <p className="text-sm text-gray-500 text-center mt-1">
          Login to continue voting
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="text-green-600 font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
