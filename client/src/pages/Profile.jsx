import { useEffect, useState } from "react";
import api from "../store/axios";
import { Navigate } from "react-router-dom";
import {
  Edit3,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  ChevronRight,
  Shield,
  Building,
} from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    api
      .get("/voters/me")
      .then((res) => setUser(res.data))
      .catch(() => setUnauthorized(true));
  }, []);

  if (unauthorized) return <Navigate to="/login" />;
  if (!user) return <div>Loading profile...</div>;

  const electionHistory = [
    {
      title: "Ward Member - Ward 5",
      party: "BJP",
      date: "15 Dec 2023",
      logo: "🏛️",
    },
    {
      title: "Gram Panchayat Election",
      party: "INC",
      date: "22 Oct 2023",
      logo: "🏛️",
    },
  ];

  return (
    <div className="flex gap-8">
      {/* Left Content */}
      <div className="flex-1 space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-white">
                {user.fullName?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {user.fullName}
          </h1>
          <p className="text-gray-500 mb-6">
            Voter ID: {user._id?.slice(-8) || "VS-2024-001"}
          </p>
          <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium">
            Edit Profile
          </button>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Personal Information
            </h2>
            <button className="text-purple-600 hover:text-purple-700">
              <Edit3 className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">{user.email}</span>
                </div>
                <button className="text-purple-600 text-sm hover:text-purple-700">
                  Change
                </button>
              </div>

              <div className="flex items-center gap-3 py-3 border-b border-gray-100">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">
                  Date of Birth: 15 Jan 1990
                </span>
              </div>

              <div className="flex items-center gap-3 py-3">
                <Building className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">
                  Gram Panchayat: Ward 5, Delhi
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">{user.mobile_number}</span>
                </div>
                <button className="text-purple-600 text-sm hover:text-purple-700">
                  Change
                </button>
              </div>

              <div className="flex items-center gap-3 py-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Address: New Delhi, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Voter Guidelines */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  Voter Guidelines
                </h3>
                <p className="text-gray-600 text-sm">
                  Understand voter guidelines before casting your vote
                </p>
              </div>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              View Guidelines
            </button>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 space-y-6">
        {/* Voting Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Voting Activity</h3>
            <button className="text-purple-600 text-sm hover:text-purple-700">
              See all
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-800">Total Votes</p>
              <p className="text-2xl font-bold text-gray-800">2</p>
            </div>
          </div>
        </div>

        {/* Election History */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Election History</h3>
            <button className="text-purple-600 text-sm hover:text-purple-700">
              See all
            </button>
          </div>

          <div className="space-y-3">
            {electionHistory.map((election, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">{election.logo}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">
                      {election.title}
                    </p>
                    <p className="text-gray-500 text-xs">
                      Voted for {election.party} · {election.date}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
        </div>

        {/* General Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">General Info</h3>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600 text-sm">Age: 34 years</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center text-xs font-bold text-white">
                M
              </span>
              <span className="text-gray-600 text-sm">Gender: Male</span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600 text-sm">New Delhi, India</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
