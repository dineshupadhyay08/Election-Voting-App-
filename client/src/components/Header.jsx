import { Bell, Search, Menu, User, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Notification from "./Notification";

const Header = ({ onMenuClick }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("isAdmin");
    navigate("/login");
    // Optionally show success message
    toast.success("Logged out successfully");
  };

  const isLoggedIn = localStorage.getItem("userId");

  return (
    <>
      {/* ================= DESKTOP HEADER ================= */}
      <div className="hidden md:flex w-full items-center justify-between">
        <div className="flex items-center bg-gray-100 rounded-full px-6 py-2 w-[420px]">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search Party/candidates"
            className="bg-transparent outline-none px-2 text-sm w-full"
          />
        </div>

        <div className="flex items-center gap-5">
          <div
            className="relative cursor-pointer"
            onClick={handleNotificationClick}
          >
            <Bell className="text-gray-600" size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-600 rounded-full"></span>
            <Notification
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
            />
          </div>

          <User
            className="text-gray-600 cursor-pointer hover:text-gray-800 transition-colors"
            size={24}
            onClick={handleProfileClick}
          />

          {isLoggedIn && (
            <LogOut
              className="text-gray-600 cursor-pointer hover:text-gray-800 transition-colors"
              size={24}
              onClick={handleLogout}
              title="Logout"
            />
          )}
        </div>
      </div>

      {/* ================= MOBILE HEADER ================= */}
      <div className="md:hidden w-full space-y-3">
        <div className="flex items-center justify-between">
          <Menu
            className="text-gray-700 cursor-pointer"
            onClick={onMenuClick}
          />

          <img
            src="/Vote.jpg"
            altalt="logo"
            className="w-10 h-10 rounded-full object-cover"
          />

          <div
            className="relative cursor-pointer"
            onClick={handleNotificationClick}
          >
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-600 rounded-full"></span>
            <Notification
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
            />
          </div>

          {isLoggedIn && (
            <LogOut
              className="text-gray-700 cursor-pointer hover:text-gray-800 transition-colors"
              size={20}
              onClick={handleLogout}
              title="Logout"
            />
          )}
        </div>

        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search Party/candidates"
            className="bg-transparent outline-none px-2 text-sm w-full"
          />
        </div>
      </div>
    </>
  );
};

export default Header;
