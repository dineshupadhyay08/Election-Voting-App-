import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Home, Vote, History, User, X } from "lucide-react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

const PublicLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F6F8FB] relative">
      {/* ================= DESKTOP SIDEBAR ================= */}
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
          <div className="fixed top-0 left-0 h-full w-1/2 bg-white z-50 md:hidden shadow-xl">
            {/* Close */}
            <div className="flex justify-end p-3">
              <X
                className="cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              />
            </div>

            {/* Sidebar content reused */}
            <Sidebar />
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

        <Footer />

        {/* ================= MOBILE BOTTOM NAV ================= */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-sm z-30">
          <div className="flex justify-around py-2 text-xs">
            <NavLink to="/" className="flex flex-col items-center gap-1">
              <Home size={18} />
              Home
            </NavLink>

            <NavLink
              to="/elections"
              className="flex flex-col items-center gap-1"
            >
              <Vote size={18} />
              Election
            </NavLink>

            <NavLink
              to="/poll-history"
              className="flex flex-col items-center gap-1"
            >
              <History size={18} />
              History
            </NavLink>

            <NavLink to="/profile" className="flex flex-col items-center gap-1">
              <User size={18} />
              Profile
            </NavLink>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default PublicLayout;
