import { useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Home, Vote, History, User, X, Flag } from "lucide-react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import MobileBottomNav from "./MobileBottomNav";

const PublicLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F6F8FB] relative">
      {/* ================= SIDEBAR ================= */}
      <Sidebar />

      {/* ================= MOBILE SIDEBAR DRAWER ================= */}
      {mobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
          />

          {/* Drawer */}
          <div className="fixed top-0 left-0 h-full w-64 bg-white z-50 md:hidden shadow-xl">
            {/* Close */}
            <div className="flex justify-end p-3">
              <X
                className="cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              />
            </div>

            {/* Mobile Sidebar Content */}
            <div className="px-2">
              {/* Logo */}
              <div className="flex items-center justify-center px-2 py-2 border-b border-gray-200 cursor-pointer mb-4">
                <img
                  src="/Vote.jpg"
                  onClick={() => {
                    navigate("/");
                    setMobileMenuOpen(false);
                  }}
                  alt="logo"
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                <NavLink
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      isActive
                        ? "bg-indigo-50 text-indigo-600 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  <Home size={18} /> Home
                </NavLink>

                <NavLink
                  to="/elections"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      isActive
                        ? "bg-indigo-50 text-indigo-600 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  <Vote size={18} /> Elections
                </NavLink>

                <NavLink
                  to="/candidates"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      isActive
                        ? "bg-indigo-50 text-indigo-600 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  <Vote size={18} /> Candidates
                </NavLink>

                <NavLink
                  to="/party"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      isActive
                        ? "bg-indigo-50 text-indigo-600 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  <Flag size={18} /> Party
                </NavLink>

                <NavLink
                  to="/poll-history"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      isActive
                        ? "bg-indigo-50 text-indigo-600 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  <History size={18} /> Poll History
                </NavLink>

                <NavLink
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      isActive
                        ? "bg-indigo-50 text-indigo-600 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  <User size={18} /> Profile
                </NavLink>
              </nav>
            </div>
          </div>
        </>
      )}

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-300 px-4 py-3">
          <Header onMenuClick={() => setMobileMenuOpen(true)} />
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
          <Outlet />
        </main>

        {/* <Footer /> */}
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default PublicLayout;
