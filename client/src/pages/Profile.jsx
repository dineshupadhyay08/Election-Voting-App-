import { useEffect, useState } from "react";
import api from "../store/axios"; // same axios instance withCredentials:true
import { Navigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    api
      .get("/voters/me") // 🔥 no token header needed
      .then((res) => setUser(res.data))
      .catch(() => setUnauthorized(true));
  }, []);

  if (unauthorized) return <Navigate to="/login" />;

  if (!user) return <div>Loading profile...</div>;

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>

      <p>
        <b>Name:</b> {user.fullName}
      </p>
      <p>
        <b>Email:</b> {user.email}
      </p>
      <p>
        <b>Mobile:</b> {user.mobile_number}
      </p>
      <p>
        <b>Role:</b> {user.isAdmin ? "Admin" : "Voter"}
      </p>
    </div>
  );
};

export default Profile;
