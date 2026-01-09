import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../store/axios";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const res = await api.post("/voters/login", form);

      localStorage.setItem("userId", res.data.id);
      localStorage.setItem("isAdmin", res.data.isAdmin);

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8 sm:py-12">
      <div className="w-full max-w-sm md:max-w-md bg-white rounded-3xl shadow-2xl px-5 sm:px-6 py-8 sm:py-10">
        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <img
            src="/Register_vote_img.jpg"
            alt="Voting Logo"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover shadow-lg mb-3 sm:mb-4"
          />
          <h2 className="text-lg sm:text-xl font-semibold">Welcome Back</h2>
          <p className="text-sm text-gray-500 mt-1 text-center">
            Login to continue voting
          </p>
        </div>

        {error && (
          <p className="text-red-600 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
            className="input-ui"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="input-ui"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-6 sm:mt-8 text-sm">
          <p>
            Don’t have an account?{" "}
            <Link to="/register" className="text-indigo-600 font-semibold">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
