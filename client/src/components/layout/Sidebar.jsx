import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Vote,
  Users,
  History,
  BarChart3,
  FileText,
  ShieldCheck,
  Sparkles,
  User,
  LogOut,
} from "lucide-react";

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isAdmin = user?.role === "ADMIN";

  const voterNav = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Elections", path: "/elections", icon: Vote },
    { label: "Candidates", path: "/candidates", icon: Users },
    { label: "Voting History", path: "/voting-history", icon: History },
    { label: "Profile", path: "/profile", icon: User },
  ];

  const adminNav = [
    { label: "Admin Overview", path: "/admin", icon: LayoutDashboard },
    { label: "Manage Elections", path: "/admin/elections", icon: Vote },
    { label: "Manage Candidates", path: "/admin/candidates", icon: Users },
    { label: "Analytics", path: "/admin/analytics", icon: BarChart3 },
    { label: "Reports", path: "/admin/reports", icon: FileText },
    { label: "Audit Logs", path: "/admin/activity-logs", icon: ShieldCheck },
    { label: "AI Insights", path: "/admin/ai-insights", icon: Sparkles },
  ];

  const items = isAdmin ? adminNav : voterNav;

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card/60 backdrop-blur-xl h-screen sticky top-0 z-30 p-4 justify-between">
      <div>
        {/* Brand Header */}
        <Link to="/" className="flex items-center gap-3 px-3 py-4 mb-6">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Vote className="h-6 w-6" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight gradient-text">
              VoteFlow AI
            </span>
            <span className="block text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              {isAdmin ? "Admin Console" : "Voter SaaS"}
            </span>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile Footer */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              {user?.fullName?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="truncate">
              <p className="text-sm font-semibold truncate">{user?.fullName}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Log out"
            className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
