import { useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  Bot,
  ChevronLeft,
  ChevronRight,
  History,
  Home,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Sparkles,
  SunMedium,
  Trophy,
  UserCircle2,
  Users,
  Vote,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const baseNavigation = [
  { label: "Dashboard", to: "/", icon: Home },
  { label: "Live Elections", to: "/elections?status=LIVE", icon: Vote },
  { label: "Upcoming Elections", to: "/elections?status=UPCOMING", icon: Sparkles },
  { label: "Candidates", to: "/candidates", icon: Users },
  { label: "Election Results", to: "/poll-history", icon: Trophy },
  { label: "AI Assistant", to: "/", icon: Bot },
  { label: "Voting History", to: "/poll-history", icon: History },
  { label: "Profile", to: "/profile", icon: UserCircle2 },
  { label: "Settings", to: "/profile", icon: Settings },
];

const secondaryItems = [
  { label: "Notifications", icon: Bell },
  { label: "Saved Candidates", icon: Sparkles },
];

const roleBadgeMap = {
  true: "Admin",
  false: "Voter",
};

const getInitials = (name = "User") =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const shellTransition = {
  type: "spring",
  stiffness: 260,
  damping: 24,
};

const ShellNavItem = ({ item, collapsed, onNavigate }) => {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      className={({ isActive }) =>
        [
          "group flex min-h-12 items-center gap-3 overflow-hidden rounded-2xl px-3 py-3 text-sm font-medium transition-colors duration-200",
          isActive
            ? "bg-[var(--accent-soft)] text-[var(--accent-strong)] shadow-[var(--shadow-soft)]"
            : "text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]",
          collapsed ? "justify-center px-2" : "",
        ].join(" ")
      }
    >
      <Icon size={18} strokeWidth={2} className="shrink-0" />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </NavLink>
  );
};

const DashboardShell = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const navigation = useMemo(() => {
    if (!user?.isAdmin) {
      return baseNavigation.filter((item) => item.label !== "Settings");
    }

    return baseNavigation;
  }, [user?.isAdmin]);

  const topLabel = useMemo(() => {
    const match = navigation.find((item) =>
      item.to === "/"
        ? location.pathname === "/"
        : location.pathname.startsWith(item.to.split("?")[0]),
    );

    return match?.label || "Dashboard";
  }, [location.pathname, navigation]);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="h-screen overflow-hidden bg-[var(--app-bg)] text-[var(--text-primary)]">
      <div className="relative flex h-full overflow-hidden">
        <AnimatePresence>
          {sidebarOpen && (
            <motion.button
              aria-label="Close menu overlay"
              className="fixed inset-0 z-30 bg-slate-950/55 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        <motion.aside
          className={[
            "fixed inset-y-0 left-0 z-40 flex h-screen w-[286px] flex-col overflow-hidden border-r border-[var(--border-soft)] bg-[var(--surface)]/94 px-4 py-5 backdrop-blur-xl transition-transform duration-300 lg:static lg:z-10 lg:h-screen lg:shrink-0 lg:translate-x-0",
            collapsed ? "lg:w-[104px]" : "",
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          ].join(" ")}
          initial={false}
          animate={{
            width: collapsed ? 104 : 286,
          }}
          transition={shellTransition}
        >
          <div className="flex items-center justify-between gap-3 px-2">
            <button
              type="button"
              className={[
                "flex min-w-0 items-center text-left",
                collapsed ? "justify-center" : "gap-3",
              ].join(" ")}
              onClick={() => navigate("/")}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-gradient)] text-white shadow-[var(--shadow-soft)]">
                <Vote size={18} strokeWidth={2} />
              </div>
              {!collapsed && (
                <div className="min-w-0">
                  <p className="text-sm font-semibold tracking-[0.24em] text-[var(--text-muted)]">
                    ELECTOR
                  </p>
                  <h1 className="truncate text-base font-semibold">Command Center</h1>
                </div>
              )}
            </button>

            <button
              type="button"
              className="hidden rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-2)] p-2 text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--text-primary)] lg:inline-flex"
              onClick={() => setCollapsed((current) => !current)}
            >
              {collapsed ? <ChevronRight size={18} strokeWidth={2} /> : <ChevronLeft size={18} strokeWidth={2} />}
            </button>
          </div>

          <div
            className={[
              "mt-8 overflow-hidden rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-2)] shadow-[var(--shadow-soft)]",
              collapsed ? "px-0 py-4" : "p-4",
            ].join(" ")}
          >
            {collapsed ? (
              <div className="flex flex-col items-center gap-3 px-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-sm font-semibold text-[var(--accent-strong)]">
                  {getInitials(user?.fullName)}
                </div>
                <span className="rounded-full border border-[var(--border-strong)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">
                  {roleBadgeMap[String(Boolean(user?.isAdmin))]}
                </span>
              </div>
            ) : (
              <>
                <p className="text-xs uppercase tracking-[0.32em] text-[var(--text-muted)]">
                  Signed in as
                </p>
                <h2 className="mt-3 truncate text-lg font-semibold">{user?.fullName || "Citizen"}</h2>
                <p className="mt-1 truncate text-sm text-[var(--text-secondary)]">{user?.email}</p>
                <span className="mt-4 inline-flex rounded-full border border-[var(--border-strong)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-strong)]">
                  {roleBadgeMap[String(Boolean(user?.isAdmin))]}
                </span>
              </>
            )}
          </div>

          <nav className="mt-8 flex-1 space-y-2 overflow-y-auto pr-1">
            {navigation.map((item) => (
              <ShellNavItem
                key={item.label}
                item={item}
                collapsed={collapsed}
                onNavigate={() => setSidebarOpen(false)}
              />
            ))}
          </nav>

          <div className="space-y-2 border-t border-[var(--border-soft)] pt-4">
            {secondaryItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.label}
                  type="button"
                  className={[
                    "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]",
                    collapsed ? "justify-center px-2" : "",
                  ].join(" ")}
                >
                  <Icon size={18} strokeWidth={2} className="shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}

            <button
              type="button"
              className={[
                "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-[var(--danger-text)] transition hover:bg-[var(--danger-soft)] hover:text-[var(--danger-strong)]",
                collapsed ? "justify-center px-2" : "",
              ].join(" ")}
              onClick={handleLogout}
            >
              <LogOut size={18} strokeWidth={2} className="shrink-0" />
              {!collapsed && <span className="truncate">Logout</span>}
            </button>
          </div>
        </motion.aside>

        <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
          <header className="sticky top-0 z-20 border-b border-[var(--border-soft)] bg-[var(--surface)]/85 backdrop-blur-xl">
            <div className="mx-auto flex w-full max-w-[1720px] items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
              <button
                type="button"
                className="inline-flex rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-2)] p-3 text-[var(--text-primary)] lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={18} strokeWidth={2} />
              </button>

              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-[0.26em] text-[var(--text-muted)]">
                  {topLabel}
                </p>
                <h2 className="truncate text-lg font-semibold sm:text-xl">
                  National voting operations
                </h2>
              </div>

              <label className="hidden min-w-[280px] items-center gap-3 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-2)] px-4 py-3 text-[var(--text-secondary)] xl:flex">
                <Search size={18} strokeWidth={2} className="shrink-0" />
                <input
                  type="search"
                  placeholder="Search elections, candidates, regions"
                  className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
                />
              </label>

              <button
                type="button"
                className="hidden rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-2)] px-4 py-3 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-3)] lg:inline-flex"
              >
                <Bot size={18} strokeWidth={2} />
                <span className="ml-2">Ask AI</span>
              </button>

              <button
                type="button"
                aria-label="Toggle color theme"
                className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-2)] p-3 text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-3)]"
                onClick={toggleTheme}
              >
                {theme === "dark" ? <SunMedium size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
              </button>

              <button
                type="button"
                className="relative rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-2)] p-3 text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-3)]"
              >
                <Bell size={18} strokeWidth={2} />
                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[var(--status-info)]" />
              </button>

              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="flex min-w-0 items-center gap-3 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-2)] px-3 py-2.5 text-left transition-colors hover:bg-[var(--surface-3)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-sm font-semibold text-[var(--accent-strong)]">
                  {getInitials(user?.fullName)}
                </div>
                <div className="hidden min-w-0 sm:block">
                  <p className="truncate text-sm font-medium">{user?.fullName || "Citizen"}</p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {roleBadgeMap[String(Boolean(user?.isAdmin))]}
                  </p>
                </div>
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="mx-auto flex w-full max-w-[1720px] min-w-0 flex-col px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
            <Outlet />
            </div>
          </main>

          <nav className="sticky bottom-0 z-20 mt-auto border-t border-[var(--border-soft)] bg-[var(--surface)]/92 px-4 py-3 backdrop-blur-xl lg:hidden">
            <div className="grid grid-cols-4 gap-2">
              {navigation.slice(0, 4).map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.to === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(item.to.split("?")[0]);

                return (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    className={[
                      "flex flex-col items-center gap-2 rounded-2xl px-3 py-2 text-xs font-medium",
                      isActive
                        ? "bg-[var(--accent-soft)] text-[var(--accent-strong)]"
                        : "text-[var(--text-secondary)]",
                    ].join(" ")}
                  >
                    <Icon size={18} strokeWidth={2} />
                    <span>{item.label.split(" ")[0]}</span>
                  </NavLink>
                );
              })}
            </div>
          </nav>

          <button
            type="button"
            className="fixed bottom-24 right-5 z-30 inline-flex items-center gap-3 rounded-full border border-[var(--border-strong)] bg-[var(--brand-gradient)] px-4 py-3 text-sm font-semibold text-white shadow-[var(--shadow-soft)] lg:hidden"
          >
            <Bot size={18} strokeWidth={2} />
            AI Assistant
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardShell;
