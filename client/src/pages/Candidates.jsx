import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal, Users, Award } from "lucide-react";
import api from "../store/axios";
import CandidateFormModal from "../components/Candidate/CandidateFormModal";

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Name");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/candidates").then((res) => setCandidates(res.data));
    api
      .get("/voters/me")
      .then((res) => setUser(res.data))
      .catch(() => {});
  }, []);

  const handleAddSuccess = () => {
    api.get("/candidates").then((res) => setCandidates(res.data));
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this candidate?")) {
      try {
        await api.delete(`/candidates/${id}`);
        setCandidates(candidates.filter((c) => c._id !== id));
      } catch (error) {
        console.error("Error deleting candidate:", error);
        alert("Error deleting candidate");
      }
    }
  };

  const handleVote = (candidateId) => {
    alert(`Vote submitted for candidate ${candidateId}`);
    // Add actual voting logic here
  };

  // Get unique parties for filter dropdown
  const parties = ["All", ...new Set(candidates.map((c) => c.party))];

  // Filter and sort candidates
  const filteredCandidates = candidates
    .filter((c) => filter === "All" || c.party === filter)
    .sort((a, b) => {
      if (sortBy === "Name") {
        return a.fullName.localeCompare(b.fullName);
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl px-6 py-6 shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Candidates
              </h1>
              <p className="text-gray-600 mt-2">
                Select your candidate and make your vote count.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="All">Filter by Party</option>
                {parties.slice(1).map((party) => (
                  <option key={party} value={party}>
                    {party}
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="Name">Sort by: Name</option>
              </select>
              {user?.isAdmin && (
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 whitespace-nowrap"
                >
                  Add Candidate
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Candidates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCandidates.map((c) => (
            <div
              key={c._id}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 relative"
            >
              {/* Party Symbol/Icon */}
              <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md">
                <Users className="w-5 h-5 text-indigo-600" />
              </div>

              {/* Candidate Photo */}
              <div className="relative mb-4">
                <img
                  src={c.image}
                  alt={c.fullName}
                  className="w-full h-48 object-cover rounded-xl"
                />
                {/* Age Badge */}
                <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm">
                  {c.age || Math.floor(Math.random() * 20) + 35}
                </div>
              </div>

              {/* Candidate Name */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {c.fullName}
              </h3>

              {/* Party Row */}
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-indigo-600" />
                <span className="text-sm text-gray-700">{c.party}</span>
              </div>

              {/* Role */}
              <p className="text-sm text-gray-500 mb-4">
                Role: GramPradhan Candidate
              </p>

              {/* Key Priorities */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-900">
                    Key Priorities:
                  </h4>
                  <MoreHorizontal className="w-4 h-4 text-gray-400 cursor-pointer" />
                </div>
                <ul className="space-y-1">
                  <li className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                    Education development
                  </li>
                  <li className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                    Healthcare facilities
                  </li>
                </ul>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/candidates/${c._id}`)}
                  className="flex-1 border-2 border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
                >
                  View Profile
                </button>
                <button
                  onClick={() => handleVote(c._id)}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Vote
                </button>
              </div>

              {/* Admin Buttons */}
              {user?.isAdmin && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => {
                      setEditingCandidate(c);
                      setShowModal(true);
                    }}
                    className="flex-1 bg-yellow-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-yellow-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="flex-1 bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {showModal && (
          <CandidateFormModal
            candidate={editingCandidate}
            onClose={() => {
              setShowModal(false);
              setEditingCandidate(null);
            }}
            onSuccess={handleAddSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default Candidates;
