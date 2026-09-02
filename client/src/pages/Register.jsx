import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Vote, AlertCircle, CheckCircle2, Loader } from "lucide-react";
import api from "../store/axios";
import ThemeToggle from "../components/ThemeToggle";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    password: "",
    password2: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) return "Full name is required";
    if (!formData.email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return "Invalid email address";
    if (!formData.mobileNumber.trim()) return "Mobile number is required";
    if (formData.mobileNumber.length < 10) return "Mobile number must be at least 10 digits";
    if (!formData.password) return "Password is required";
    if (formData.password.length < 6) return "Password must be at least 6 characters";
    if (formData.password !== formData.password2) return "Passwords do not match";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      await api.post("/voters/register", {
        fullName: formData.fullName,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        password: formData.password,
      });

      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 sm:py-12 animate-fade-in">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm card-lg p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="glass rounded-2xl p-3 mb-4">
            <Vote size={32} className="text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold mb-1">Join VoteFlow</h1>
          <p className="text-text-muted">Create your voting account</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-3 animate-slide-down">
            <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex gap-3 animate-slide-down">
            <CheckCircle2 size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-500">{success}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label className="label">Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label className="label">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label className="label">Mobile Number</label>
            <input
              type="tel"
              name="mobileNumber"
              placeholder="9876543210"
              value={formData.mobileNumber}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label className="label">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Min. 6 characters"
                value={formData.password}
                onChange={handleChange}
                className="input pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="label">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="password2"
                placeholder="Confirm your password"
                value={formData.password2}
                onChange={handleChange}
                className="input pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 flex items-center justify-center gap-2 mt-6"
          >
            {loading ? (
              <>
                <Loader size={18} className="animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent"></div>
        </div>

        {/* Terms */}
        <p className="text-xs text-text-muted text-center mb-6">
          By registering, you agree to participate in democratic elections securely and responsibly.
        </p>

        {/* Footer */}
        <div className="text-center">
          <p className="text-text-muted text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-amber-500 hover:text-amber-600 font-medium transition">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
