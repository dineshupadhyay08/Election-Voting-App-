import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * RoleBasedRoute - Enforces role-based access control
 * Assumes it's wrapped in ProtectedLayout
 */
const RoleBasedRoute = ({
  children,
  requiredRole = "user", // "user", "admin", or null
}) => {
  const { user } = useAuth();

  // Role check
  if (requiredRole === "admin" && !user.isAdmin) {
    return <Navigate to="/home" replace />;
  }

  if (requiredRole === "user" && user.isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default RoleBasedRoute;
