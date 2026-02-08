import { NavLink, useNavigate } from "react-router-dom";
import { Home, Vote, History, User, Flag } from "lucide-react";

const Sidebar = () => {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition 
     ${
       isActive
         ? "bg-indigo-50 text-indigo-600 font-medium"
         : "text-gray-700 hover:bg-gray-100"
     }`;

  const navigate = useNavigate();

  return (
    <aside className="w-full md:w-56 h-auto md:h-screen bg-white border-b md:border-r border-gray-200 sticky top-0 z-10">
      {/* Logo */}
      <div className="flex items-center justify-center px-2 py-2 border-b border-gray-200 cursor-pointer">
        <img
          src="/Vote.jpg"
          onClick={() => navigate("/")}
          alt="logo"
          className="w-14 h-14 rounded-full object-cover"
        />
      </div>

      {/* Navigation */}
      <nav className="mt-6 space-y-3 px-2 flex flex-wrap md:flex-col justify-center md:justify-start">
        <NavLink to="/" className={linkClass}>
          <Home size={18} /> Home
        </NavLink>

        <NavLink to="/elections" className={linkClass}>
          <Vote size={18} /> Elections
        </NavLink>

        <NavLink to="/candidates" className={linkClass}>
          <Vote size={18} /> Candidates
        </NavLink>

        {/* <NavLink to="/party" className={linkClass}>
          <Flag size={18} /> Party
        </NavLink> */}

        <NavLink to="/poll-history" className={linkClass}>
          <History size={18} /> Poll History
        </NavLink>

        <NavLink to="/profile" className={linkClass}>
          <User size={18} /> Profile
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
