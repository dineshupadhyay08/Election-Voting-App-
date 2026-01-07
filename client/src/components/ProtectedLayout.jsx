import { Navigate, Outlet } from "react-router-dom";

const ProtectedLayout = () => {
  const token = localStorage.getItem("token");

  // ❌ Login nahi → login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Login hai → page allow
  return <Outlet />;
};

export default ProtectedLayout;
