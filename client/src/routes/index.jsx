import { createBrowserRouter, Navigate } from "react-router-dom";

import PublicLayout from "../components/PublicLayout";
import AuthLayout from "../components/AuthLayout";
import ProtectedLayout from "../components/ProtectedLayout";
import AdminLayout from "../components/AdminLayout";
import RoleBasedRoute from "../components/RoleBasedRoute";

import Landing from "../pages/Landing";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Elections from "../pages/Elections";
import ElectionDetails from "../pages/ElectionDetails";
import PollHistory from "../pages/PollHistory";
import Profile from "../pages/Profile";
import Candidates from "../pages/Candidates";
import CandidateDetails from "../pages/CandidatesDetails";
import AdminDashboard from "../pages/AdminDashboard";
import AdminElections from "../pages/admin/AdminElections";
import AdminCandidates from "../pages/admin/AdminCandidates";
import AdminMonitoring from "../pages/admin/AdminMonitoring";
import AdminResults from "../pages/admin/AdminResults";
import AdminVoters from "../pages/admin/AdminVoters";

const router = createBrowserRouter([
  // 🔓 PUBLIC LANDING - ROOT PATH
  { path: "/", element: <Landing /> },
  { path: "/landing", element: <Landing /> },

  // 🔓 AUTH PAGES
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },

  // 🔐 PROTECTED PAGES
  {
    element: <ProtectedLayout />,
    children: [
      // NORMAL USER ROUTES
      {
        element: <PublicLayout />,
        children: [
          {
            path: "/home",
            element: (
              <RoleBasedRoute requiredRole="user">
                <Home />
              </RoleBasedRoute>
            ),
          },
          {
            path: "/elections",
            element: (
              <RoleBasedRoute requiredRole="user">
                <Elections />
              </RoleBasedRoute>
            ),
          },
          {
            path: "/elections/:id",
            element: (
              <RoleBasedRoute requiredRole="user">
                <ElectionDetails />
              </RoleBasedRoute>
            ),
          },
          {
            path: "/candidates",
            element: (
              <RoleBasedRoute requiredRole="user">
                <Candidates />
              </RoleBasedRoute>
            ),
          },
          {
            path: "/candidates/:id",
            element: (
              <RoleBasedRoute requiredRole="user">
                <CandidateDetails />
              </RoleBasedRoute>
            ),
          },
          {
            path: "/poll-history",
            element: (
              <RoleBasedRoute requiredRole="user">
                <PollHistory />
              </RoleBasedRoute>
            ),
          },
          {
            path: "/profile",
            element: (
              <RoleBasedRoute requiredRole={null}>
                <Profile />
              </RoleBasedRoute>
            ),
          },
        ],
      },

      // ADMIN ROUTES
      {
        element: <AdminLayout />,
        children: [
          {
            path: "/admin/dashboard",
            element: (
              <RoleBasedRoute requiredRole="admin">
                <AdminDashboard />
              </RoleBasedRoute>
            ),
          },
          {
            path: "/admin/elections",
            element: (
              <RoleBasedRoute requiredRole="admin">
                <AdminElections />
              </RoleBasedRoute>
            ),
          },
          {
            path: "/admin/candidates",
            element: (
              <RoleBasedRoute requiredRole="admin">
                <AdminCandidates />
              </RoleBasedRoute>
            ),
          },
          {
            path: "/admin/monitoring",
            element: (
              <RoleBasedRoute requiredRole="admin">
                <AdminMonitoring />
              </RoleBasedRoute>
            ),
          },
          {
            path: "/admin/results",
            element: (
              <RoleBasedRoute requiredRole="admin">
                <AdminResults />
              </RoleBasedRoute>
            ),
          },
          {
            path: "/admin/voters",
            element: (
              <RoleBasedRoute requiredRole="admin">
                <AdminVoters />
              </RoleBasedRoute>
            ),
          },
        ],
      },
    ],
  },

  // Fallback
  { path: "*", element: <Navigate to="/landing" replace /> },
]);

export default router;
