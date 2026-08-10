import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LayoutDashboard, Vote, Users, History, User } from "lucide-react";

export const MobileNav = () => {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = user?.role === "ADMIN"
    ? [
        { label: "Overview", path: "/admin", icon: LayoutDashboard },
        { label: "Elections", path: "/admin/elections", icon: Vote },
        { label: "Candidates", path: "/admin/candidates", icon: Users },
        { label: "Profile", path: "/profile", icon: User },
      ]
    : [
        { label: "Dash", path: "/dashboard", icon: LayoutDashboard },
        { label: "Elections", path: "/elections", icon: Vote },
        { label: "Candidates", path: "/candidates", icon: Users },
        { label: "History", path: "/voting-history", icon: History },
        { label: "Profile", path: "/profile", icon: User },
      ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-card/90 backdrop-blur-lg px-2 py-2 flex items-center justify-around">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              isActive ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
