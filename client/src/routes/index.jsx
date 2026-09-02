import { createBrowserRouter, Navigate } from "react-router-dom";

import PublicLayout from "../components/PublicLayout";
import AuthLayout from "../components/AuthLayout";
import ProtectedLayout from "../components/ProtectedLayout";

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
      {
        element: <PublicLayout />,
        children: [
          { path: "/home", element: <Home /> },
          { path: "/elections", element: <Elections /> },
          { path: "/elections/:id", element: <ElectionDetails /> },
          { path: "/candidates", element: <Candidates /> },
          { path: "/candidates/:id", element: <CandidateDetails /> },
          { path: "/poll-history", element: <PollHistory /> },
          { path: "/profile", element: <Profile /> },
          { path: "/admin/dashboard", element: <AdminDashboard /> },
        ],
      },
    ],
  },

  // Fallback
  { path: "*", element: <Navigate to="/landing" replace /> },
]);

export default router;
