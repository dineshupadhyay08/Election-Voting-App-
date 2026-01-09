import { Bell, Search, Menu } from "lucide-react";

const Header = ({ onMenuClick }) => {
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
          <div className="relative cursor-pointer">
            <Bell className="text-gray-600" size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-600 rounded-full"></span>
          </div>

          <img
            src="/user.png"
            alt="user"
            className="w-8 h-8 rounded-full object-cover cursor-pointer"
          />
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

          <div className="relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-600 rounded-full"></span>
          </div>
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
