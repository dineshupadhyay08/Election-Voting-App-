import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

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

      // 🔥 LOGIN (COOKIE BASED)
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/voters/login`,
        form,
        {
          withCredentials: true, // ✅ VERY IMPORTANT
        }
      );

      // optional data (token cookie me hai)
      localStorage.setItem("userId", res.data.id);
      localStorage.setItem("isAdmin", res.data.isAdmin);

      // redirect
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-white px-4 pt-12 pb-12">
      <div className="w-full max-w-sm md:max-w-md bg-white rounded-3xl shadow-2xl px-6 py-10 mt-6">
        <div className="flex flex-col items-center mt-6 mb-8">
          <img
            src="/Register_vote_img.jpg"
            alt="Voting Logo"
            className="w-20 h-20 rounded-full object-cover shadow-lg mb-4"
          />
          <h2 className="text-xl font-semibold">Welcome Back</h2>
          <p className="text-sm text-gray-500 mt-1">Login to continue voting</p>
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
            className={`w-full text-white font-semibold py-3 rounded-xl transition
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-8 text-sm">
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
