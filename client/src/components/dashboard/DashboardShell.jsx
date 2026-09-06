import { Outlet } from "react-router-dom";
import FloatingNavbar from "../FloatingNavbar";
import { useAuth } from "../../context/AuthContext";

const DashboardShell = () => {
  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--text-primary)]">
      {/* Shared Floating Navbar for all roles */}
      <FloatingNavbar />

      {/* Main content */}
      <main className="overflow-y-auto overflow-x-hidden">
        <div className="mx-auto flex w-full max-w-[1720px] min-w-0 flex-col px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardShell;
