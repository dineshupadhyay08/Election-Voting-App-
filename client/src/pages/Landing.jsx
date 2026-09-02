import React from "react";
import { useNavigate } from "react-router-dom";
import { Vote, ArrowRight, CheckCircle2, Users, BarChart3, Shield } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Vote,
      title: "Secure Voting",
      description: "Cast your vote securely with verified authentication",
    },
    {
      icon: Users,
      title: "Multiple Elections",
      description: "Participate in national and local election cycles",
    },
    {
      icon: BarChart3,
      title: "Live Results",
      description: "Track real-time election statistics and turnout",
    },
    {
      icon: Shield,
      title: "Data Protected",
      description: "Your voting information is encrypted and private",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="glass-strong sticky top-0 z-50 px-4 sm:px-6 py-4 border-b border-amber-900/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="glass rounded-xl p-2">
              <Vote size={24} className="text-amber-500" />
            </div>
            <h1 className="text-xl font-bold">VoteFlow</h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => navigate("/login")}
              className="btn-secondary px-6"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="btn-primary px-6"
            >
              Register
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="badge-info">
                <Vote size={14} />
                <span>Election Platform</span>
              </div>
            </div>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            Your Voice Matters
          </h2>

          <p className="text-lg sm:text-xl text-text-soft mb-8 max-w-2xl mx-auto">
            Participate in democratic elections with a secure, transparent, and user-friendly voting platform. Cast your vote and track real-time results.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={() => navigate("/register")}
              className="btn-primary flex items-center justify-center gap-2 px-8 py-3"
            >
              Get Started <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="btn-secondary px-8 py-3"
            >
              Sign In
            </button>
          </div>

          {/* Featured Election Preview */}
          <div className="card-lg p-6 sm:p-8 animate-slide-up">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-semibold mb-2">Active Elections</h3>
              <p className="text-text-muted">Join thousands of voters participating today</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass rounded-xl p-4">
                <div className="badge-live mb-2 justify-center">
                  <span>● LIVE</span>
                </div>
                <h4 className="font-semibold mb-1">General Elections 2026</h4>
                <p className="text-sm text-text-muted">National Level</p>
              </div>
              <div className="glass rounded-xl p-4">
                <div className="badge-warning mb-2 justify-center">
                  <span>Upcoming</span>
                </div>
                <h4 className="font-semibold mb-1">State Assembly</h4>
                <p className="text-sm text-text-muted">Regional Elections</p>
              </div>
              <div className="glass rounded-xl p-4">
                <div className="badge-info mb-2 justify-center">
                  <span>Voting Open</span>
                </div>
                <h4 className="font-semibold mb-1">Local Governance</h4>
                <p className="text-sm text-text-muted">Municipal Level</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 sm:px-6 py-12 sm:py-20 bg-gradient-to-b from-transparent to-amber-500/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl sm:text-4xl font-bold mb-4">Why Choose VoteFlow?</h3>
            <p className="text-lg text-text-soft">A modern platform built for democratic participation</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="card p-6 hover:shadow-lg transition-all duration-300 animate-fade-in stagger-{idx}"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="glass rounded-2xl p-4 w-fit mb-4">
                    <Icon size={24} className="text-amber-500" />
                  </div>
                  <h4 className="font-semibold mb-2">{feature.title}</h4>
                  <p className="text-sm text-text-muted">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto card-lg p-8 sm:p-12 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Vote?</h3>
          <p className="text-lg text-text-soft mb-8">
            Register or login to your account and start voting in active elections.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/register")}
              className="btn-primary px-8 py-3"
            >
              Create Account
            </button>
            <button
              onClick={() => navigate("/login")}
              className="btn-secondary px-8 py-3"
            >
              Login to Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-amber-900/10 px-4 sm:px-6 py-8">
        <div className="max-w-6xl mx-auto text-center text-text-muted text-sm">
          <p>© 2026 VoteFlow. Secure voting platform for democratic participation.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
