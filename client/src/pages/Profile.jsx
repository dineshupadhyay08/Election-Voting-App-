import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/voters/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setUser(res.data))
      .catch((err) => console.log(err));
  }, []);

  if (!token) return <Navigate to="/login" />;

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
