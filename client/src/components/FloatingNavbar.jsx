import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Vote,
  Users,
  History,
  UserCircle2,
  LogOut,
  Moon,
  SunMedium,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const FloatingNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navItems = [
    { label: "Home", to: "/home", icon: Home },
    { label: "Elections", to: "/elections", icon: Vote },
    { label: "Candidates", to: "/candidates", icon: Users },
    { label: "Voting History", to: "/poll-history", icon: History },
    { label: "Profile", to: "/profile", icon: UserCircle2 },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  // Scroll animation
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show navbar at top
      if (currentScrollY < 100) {
        setIsVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }

      // Hide on scroll down
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }

      // Show on scroll up
      if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const getInitials = (name = "User") =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <>
      {/* Fixed spacing to prevent content shift */}
      <div className="h-20 md:h-16" />

      {/* Floating Navbar */}
      <motion.nav
        initial={{ y: 0, opacity: 1 }}
        animate={{
          y: isVisible ? 0 : -120,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
      >
        <div className="flex justify-center px-4 py-3 md:py-4">
          <div
            className="pointer-events-auto w-full max-w-6xl rounded-full border border-[var(--border-soft)] bg-[var(--surface)]/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] px-4 md:px-6"
            style={{
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
            }}
          >
            <div className="flex items-center justify-between gap-4 h-14 md:h-16">
              {/* Logo */}
              <button
                onClick={() => navigate("/home")}
                className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--brand-gradient)] text-white">
                  <Vote size={16} strokeWidth={2} />
                </div>
                <span className="hidden sm:inline text-sm font-semibold tracking-wider text-[var(--text-primary)]">
                  ELECTOR
                </span>
              </button>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    location.pathname === item.to ||
                    location.pathname.startsWith(item.to.split("?")[0]);

                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-200 ${
                        isActive
                          ? "bg-[var(--accent-soft)] text-[var(--accent-strong)]"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)]"
                      }`}
                    >
                      <Icon size={16} strokeWidth={2} />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-2)] transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? (
                    <SunMedium size={16} strokeWidth={2} />
                  ) : (
                    <Moon size={16} strokeWidth={2} />
                  )}
                </button>

                {/* Profile Dropdown Trigger */}
                <div className="hidden sm:flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-[var(--surface-2)] cursor-pointer transition-colors group">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent-soft)] text-xs font-semibold text-[var(--accent-strong)]">
                    {getInitials(user?.fullName)}
                  </div>
                  <span className="text-xs font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
                    {user?.fullName?.split(" ")[0] || "User"}
                  </span>
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-2)] transition-colors"
                >
                  {mobileMenuOpen ? (
                    <X size={18} strokeWidth={2} />
                  ) : (
                    <Menu size={18} strokeWidth={2} />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="md:hidden border-t border-[var(--border-soft)] mt-2 pt-2 pb-2 space-y-1"
                >
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      location.pathname === item.to ||
                      location.pathname.startsWith(item.to.split("?")[0]);

                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-[var(--accent-soft)] text-[var(--accent-strong)]"
                            : "text-[var(--text-secondary)] hover:bg-[var(--surface-2)]"
                        }`}
                      >
                        <Icon size={16} strokeWidth={2} />
                        <span>{item.label}</span>
                      </NavLink>
                    );
                  })}

                  <div className="border-t border-[var(--border-soft)] mt-2 pt-2">
                    <button
                      onClick={() => navigate("/profile")}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-2)] transition-colors"
                    >
                      <UserCircle2 size={16} strokeWidth={2} />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[var(--danger-text)] hover:bg-[var(--danger-soft)] transition-colors"
                    >
                      <LogOut size={16} strokeWidth={2} />
                      <span>Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.nav>
    </>
  );
};

export default FloatingNavbar;
