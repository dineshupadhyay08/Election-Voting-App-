import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Mail, Phone, MapPin, Loader, AlertTriangle } from "lucide-react";
import api from "../store/axios";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get("/voters/me");
        setProfile(res.data);
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      try {
        await api.post("/voters/logout");
        await logout();
        navigate("/landing");
      } catch (err) {
        alert("Logout failed");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader size={40} className="animate-spin text-amber-500 mx-auto mb-4" />
          <p className="text-text-muted">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-8 text-center">
        <AlertTriangle size={40} className="mx-auto text-red-500 mb-4" />
        <p className="text-text-muted">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="mt-1 text-text-muted">Manage your account information</p>
      </div>

      {/* Profile Card */}
      <div className="card-lg p-6 sm:p-8">
        <div className="flex items-start justify-between gap-6 mb-6">
          <div>
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-2xl">
              {profile?.fullName
                ?.split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{profile?.fullName}</h2>
            <p className="mt-1 inline-flex items-center gap-2">
              <span className="badge-info">
                {profile?.isAdmin ? "Admin" : "Voter"}
              </span>
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 mb-6">
          <div className="glass rounded-xl p-4 flex items-start gap-3">
            <Mail size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                Email
              </p>
              <p className="mt-1 font-medium break-all">{profile?.email}</p>
            </div>
          </div>

          {profile?.mobileNumber && (
            <div className="glass rounded-xl p-4 flex items-start gap-3">
              <Phone size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                  Mobile
                </p>
                <p className="mt-1 font-medium">{profile.mobileNumber}</p>
              </div>
            </div>
          )}

          {profile?.address && (
            <div className="glass rounded-xl p-4 flex items-start gap-3 sm:col-span-2">
              <MapPin size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                  Address
                </p>
                <p className="mt-1 font-medium">
                  {typeof profile.address === "object"
                    ? `${profile.address.street || ""}, ${profile.address.city || ""}, ${profile.address.state || ""}`
                    : profile.address}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-amber-900/10">
          <button
            onClick={handleLogout}
            className="btn-danger flex items-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      {profile?.votedElections && (
        <div className="card-lg p-6 sm:p-8">
          <h3 className="text-xl font-bold mb-4">Voting Activity</h3>
          <div className="glass rounded-xl p-4">
            <p className="text-sm text-text-muted">Elections voted in</p>
            <p className="text-3xl font-bold text-amber-500">
              {profile.votedElections.length || 0}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
