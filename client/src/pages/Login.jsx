import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Vote, AlertCircle, Loader } from "lucide-react";
import api from "../store/axios";
import ThemeToggle from "../components/ThemeToggle";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/voters/login", form);

      localStorage.setItem("userId", res.data.id);
      localStorage.setItem("isAdmin", res.data.isAdmin);
      await queryClient.invalidateQueries({ queryKey: ["auth"] });

      navigate(location.state?.from?.pathname || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
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
            <Vote size={32} style={{ color: 'var(--brand-primary)' }} />
          </div>
          <h1 className="text-2xl font-bold mb-1">Welcome Back</h1>
          <p className="text-text-muted">Login to your voting account</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl border flex gap-3 animate-slide-down" style={{
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            borderColor: 'var(--status-error)',
          }}>
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--status-error)' }} />
            <p className="text-sm" style={{ color: 'var(--status-error)' }}>{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label className="label">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              value={form.email}
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
                placeholder="Enter your password"
                value={form.password}
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

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 flex items-center justify-center gap-2 mt-6"
          >
            {loading ? (
              <>
                <Loader size={18} className="animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px" style={{
            backgroundImage: 'linear-gradient(to right, transparent, var(--brand-primary), transparent)',
            opacity: 0.2
          }}></div>
        </div>

        {/* Demo Credentials */}
        <div className="space-y-3 mb-6 p-4 rounded-xl border" style={{
          backgroundColor: 'var(--accent-soft)',
          borderColor: 'var(--accent-border)'
        }}>
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Demo Accounts</p>
          <div className="space-y-2 text-xs">
            <div>
              <p className="text-text-soft font-medium">Voter:</p>
              <p className="text-text-muted">dienshu@gmail.com / Dinesh@123</p>
            </div>
            <div>
              <p className="text-text-soft font-medium">Admin:</p>
              <p className="text-text-muted">dk@gmail.com / Dinesh@123</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-text-muted text-sm">
            Don't have an account?{" "}
            <Link to="/register" style={{ color: 'var(--brand-primary)' }} className="hover:opacity-80 font-medium transition">
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
