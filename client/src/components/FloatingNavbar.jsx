import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Vote,
  Users,
  ClipboardList,
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
import AshokaChakra from "./AshokaChakra";

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
    { label: "My Votes", to: "/poll-history", icon: ClipboardList },
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
      <div className="h-20 md:h-16 mb-16 md:mb-0" />

      {/* Floating Navbar (Desktop) */}
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
        className="fixed top-0 left-0 right-0 z-40 pointer-events-none hidden md:block"
      >
        <div className="flex justify-center px-4 py-3 md:py-4">
          <div
            className="pointer-events-auto w-full max-w-6xl rounded-full border border-[var(--border-soft)] bg-[var(--surface)]/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] px-6"
            style={{
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
            }}
          >
            <div className="flex items-center justify-between gap-6 h-16">
              {/* Logo */}
              <button
                onClick={() => navigate("/home")}
                className="flex items-center gap-2.5 flex-shrink-0 hover:opacity-80 transition-opacity"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--brand-gradient)] text-white">
                  <Vote size={18} strokeWidth={2} />
                </div>
                <span className="text-sm font-semibold tracking-wide text-[var(--text-primary)]">
                  ELECTOR
                </span>
              </button>

              {/* Desktop Navigation */}
              <div className="flex items-center gap-1 flex-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    location.pathname === item.to ||
                    location.pathname.startsWith(item.to.split("?")[0]);

                  // Use Ashoka Chakra for Elections, regular icons for others
                  const isElections = item.to === "/elections";
                  const displayIcon = isElections ? <AshokaChakra size={20} strokeWidth={1.5} /> : <Icon size={18} strokeWidth={2} />;

                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-[var(--accent-soft)] text-[var(--accent-strong)] shadow-sm"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)]"
                      }`}
                    >
                      {displayIcon}
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-2)] transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? (
                    <SunMedium size={18} strokeWidth={2} />
                  ) : (
                    <Moon size={18} strokeWidth={2} />
                  )}
                </button>

                {/* Profile Dropdown Trigger */}
                <button
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[var(--surface-2)] transition-colors group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-soft)] text-xs font-semibold text-[var(--accent-strong)]">
                    {getInitials(user?.fullName)}
                  </div>
                  <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
                    {user?.fullName?.split(" ")[0] || "User"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[var(--surface)]/80 backdrop-blur-xl border-b border-[var(--border-soft)]">
        <div className="flex items-center justify-between gap-3 h-16 px-4">
          {/* Logo */}
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 flex-shrink-0"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand-gradient)] text-white">
              <Vote size={16} strokeWidth={2} />
            </div>
            <span className="text-xs font-semibold tracking-wide text-[var(--text-primary)]">
              ELECTOR
            </span>
          </button>

          {/* Mobile Right Actions */}
          <div className="flex items-center gap-2">
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

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-2)] transition-colors"
            >
              {mobileMenuOpen ? (
                <X size={18} strokeWidth={2} />
              ) : (
                <Menu size={18} strokeWidth={2} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-[var(--border-soft)] bg-[var(--surface-2)]"
            >
              <div className="p-3 space-y-1">
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
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-[var(--accent-soft)] text-[var(--accent-strong)]"
                          : "text-[var(--text-secondary)] hover:bg-[var(--surface)]"
                      }`}
                    >
                      <Icon size={18} strokeWidth={2} />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}

                <div className="border-t border-[var(--border-soft)] mt-2 pt-2">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--surface)] transition-colors"
                  >
                    <UserCircle2 size={18} strokeWidth={2} />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--danger-text)] hover:bg-[var(--danger-soft)] transition-colors"
                  >
                    <LogOut size={18} strokeWidth={2} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Bottom Navigation */}
      <motion.nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--surface)]/80 backdrop-blur-xl border-t border-[var(--border-soft)]">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.to ||
              location.pathname.startsWith(item.to.split("?")[0]);

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center justify-center gap-1 w-16 h-14 rounded-lg text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[var(--accent-soft)] text-[var(--accent-strong)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                <Icon size={20} strokeWidth={2} />
                <span className="leading-tight">{item.label.split(" ")[0]}</span>
              </NavLink>
            );
          })}
        </div>
      </motion.nav>
    </>
  );
};

export default FloatingNavbar;
