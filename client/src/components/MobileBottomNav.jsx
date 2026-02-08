import { NavLink, useLocation } from "react-router-dom";
import { Home, Vote, History, User } from "lucide-react";
import useMobile from "../hook/userMobile";

const MobileBottomNav = () => {
  const [isMobile] = useMobile();
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/elections", icon: Vote, label: "Election" },
    { path: "/candidates", icon: Vote, label: "Candidates" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  if (!isMobile) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 z-50 md:hidden">
      <div className="flex justify-around items-center py-2 px-4">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <NavLink
              key={path}
              to={path}
              className={`flex flex-col items-center justify-center p-2 rounded-full transition-all duration-300 ${
                isActive
                  ? "bg-indigo-100 text-indigo-600 scale-110"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon
                size={isActive ? 24 : 20}
                className="transition-all duration-300"
              />
              {isActive && (
                <span className="text-xs font-medium mt-1 transition-opacity duration-300">
                  {label}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
