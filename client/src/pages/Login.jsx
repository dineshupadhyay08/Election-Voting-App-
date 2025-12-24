import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Login submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/voters/login`,
        formData
      );

      // ✅ Save user info + token
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
      }
      localStorage.setItem("voter", JSON.stringify(res.data.user || res.data));

      console.log("✅ Login success:", res.data);
      navigate("/"); // redirect to home
    } catch (err) {
      console.log("❌ Login error:", err);
      setError(err.response?.data?.message || "Login failed, try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-green-100">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          लॉगिन करें / Login
        </h2>

        {error && (
          <p className="text-red-600 text-center mb-3 font-semibold">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="अपना ईमेल लिखें / Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                       focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="अपना पासवर्ड लिखें / Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                       focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
          />

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="text-green-600 border-gray-300 rounded"
              />
              <span className="text-gray-700">मुझे याद रखें / Remember me</span>
            </label>

            <Link
              to="/forgot-password"
              className="text-green-700 hover:underline font-medium"
            >
              पासवर्ड भूल गए? / Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2 rounded-lg 
                       hover:bg-green-800 transition font-semibold text-lg cursor-pointer"
          >
            लॉगिन करें / Login
          </button>

          {/* Register Link */}
          <p className="text-center text-gray-700 text-sm mt-4">
            खाता नहीं है?{" "}
            <Link
              to="/register"
              className="text-green-700 font-semibold hover:underline"
            >
              नया खाता बनाएं / Create an Account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
