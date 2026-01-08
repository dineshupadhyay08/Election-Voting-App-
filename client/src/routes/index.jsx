import { createBrowserRouter } from "react-router-dom";

import PublicLayout from "../components/PublicLayout";
import AuthLayout from "../components/AuthLayout";
import ProtectedLayout from "../components/ProtectedLayout";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Elections from "../pages/Elections";
import PollHistory from "../pages/PollHistory";
import Profile from "../pages/Profile";
import Candidates from "../pages/Candidates";
import CandidateDetails from "../pages/CandidatesDetails";

const router = createBrowserRouter([
  // 🔐 PROTECTED PAGES
  {
    element: <ProtectedLayout />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { path: "/", element: <Home /> },

          { path: "/elections", element: <Elections /> },
          { path: "/candidates", element: <Candidates /> },
          { path: "/candidates/:id", element: <CandidateDetails /> },
          { path: "/poll-history", element: <PollHistory /> },
          { path: "/profile", element: <Profile /> },
        ],
      },
    ],
  },

  // 🔓 AUTH PAGES
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
]);

export default router;
