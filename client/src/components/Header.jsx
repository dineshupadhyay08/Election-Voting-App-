import { Bell, Search } from "lucide-react";

const Header = () => {
  return (
    <div className=" w-full flex items-center justify-between">
      {/* 🔍 SEARCH (center-left like image) */}
      <div className="flex items-center bg-gray-100 rounded-full px-6 py-2 w-[420px]">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search Party/candidates"
          className="bg-transparent outline-none px-2 text-sm w-full"
        />
      </div>

      {/* 🔔 RIGHT ICONS (end aligned exactly like image) */}
      <div className="flex items-center gap-5">
        {/* Notification */}
        <div className="relative cursor-pointer">
          <Bell className="text-gray-600" size={20} />
          {/* Purple dot */}
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-600 rounded-full"></span>
        </div>

        {/* User Avatar */}
        <img
          src="/user.png" // image jaisa avatar
          alt="user"
          className="w-8 h-8 rounded-full object-cover cursor-pointer"
        />
      </div>
    </div>
  );
};

export default Header;
