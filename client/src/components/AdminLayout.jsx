import { Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, Users, UserCircle, Vote, BarChart3, Settings, Activity } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const AdminLayout = () => {
  const navItems = [
    { name: "Overview", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Elections", path: "/admin/elections", icon: Vote },
    { name: "Monitoring", path: "/admin/monitoring", icon: Activity },
    { name: "Candidates", path: "/admin/candidates", icon: UserCircle },
    { name: "Voters", path: "/admin/voters", icon: Users },
    { name: "Results", path: "/admin/results", icon: BarChart3 },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-[var(--bg-base)]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[var(--divider)] p-6">
        <div className="text-xl font-bold mb-8 text-[var(--brand-primary)]">ELECTOR ADMIN</div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-[var(--brand-100)] text-[var(--brand-900)] dark:bg-[var(--brand-900)] dark:text-[var(--brand-100)]"
                    : "text-[var(--text-muted)] hover:bg-[var(--surface-hover)] dark:text-[var(--text-muted)]"
                }`
              }
            >
              <item.icon size={18} />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <header className="border-b border-[var(--divider)] px-8 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--text)]">Dashboard</h2>
          <ThemeToggle />
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
