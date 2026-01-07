import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

const PublicLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#F6F8FB]">
      {/* Sidebar */}
      <Sidebar />

      {/* Right Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-18 bg-white border-b border-gray-300 flex items-center px-6">
          <Header />
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>

        {/* Footer (optional) */}
        <Footer />
      </div>
    </div>
  );
};

export default PublicLayout;
