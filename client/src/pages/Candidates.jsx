import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal, Award } from "lucide-react";
import api from "../store/axios";
import CandidateFormModal from "../components/Candidate/CandidateFormModal";
import { toast } from "react-toastify";

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/candidates").then((res) => setCandidates(res.data));
    api
      .get("/voters/me")
      .then((res) => setUser(res.data))
      .catch(() => {});
  }, []);

  const handleVote = (id) => {
    toast.success(`Vote submitted for ${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this candidate?")) {
      try {
        await api.delete(`/candidates/${id}`);
        setCandidates((prev) => prev.filter((c) => c._id !== id));
        toast.success("Candidate deleted successfully!");
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete candidate");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* HEADER */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Candidates
              </h1>
              <p className="text-gray-600 mt-1">
                Select your candidate and make your vote count.
              </p>
            </div>
            {user?.isAdmin && (
              <button
                onClick={() => setShowModal(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700"
              >
                Add Candidate
              </button>
            )}
          </div>
        </div>

        {/* CANDIDATES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {candidates.map((c) => (
            <div
              key={c._id}
              className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition"
            >
              {/* MOBILE + DESKTOP FLEX */}
              <div className="flex flex-row sm:flex-col gap-4">
                {/* IMAGE */}
                <div className="flex-shrink-0">
                  <img
                    src={c.image}
                    alt={c.fullName}
                    className="w-24 h-24 sm:w-full sm:h-48 object-cover rounded-xl"
                  />
                </div>

                {/* INFO */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">
                    {c.fullName}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-gray-700 mt-1">
                    <Award className="w-4 h-4 text-indigo-600" />
                    {c.party}
                  </div>

                  <p className="text-sm text-gray-500 mt-1">
                    Age {c.age || 40}
                  </p>

                  {/* PRIORITIES */}
                  <ul className="mt-2 text-sm text-gray-600 space-y-1">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                      Education development
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                      Education development
                    </li>
                  </ul>
                </div>
              </div>

              {/* BUTTONS */}
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => navigate(`/candidates/${c._id}`)}
                  className="flex-1 border-2 border-indigo-600 text-indigo-600 py-2 rounded-lg font-medium hover:bg-indigo-50"
                >
                  View Profile
                </button>

                <button
                  onClick={() => handleVote(c._id)}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700"
                >
                  Vote
                </button>
              </div>

              {/* ADMIN */}
              {user?.isAdmin && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => {
                      setEditingCandidate(c);
                      setShowModal(true);
                    }}
                    className="flex-1 bg-yellow-500 text-white py-1.5 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="flex-1 bg-red-600 text-white py-1.5 rounded"
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
            onSuccess={(newCandidate) => {
              if (editingCandidate) {
                // Update existing candidate
                setCandidates((prev) =>
                  prev.map((c) =>
                    c._id === newCandidate._id ? newCandidate : c,
                  ),
                );
                toast.success("Candidate updated successfully!");
              } else {
                // Add new candidate
                setCandidates((prev) => [newCandidate, ...prev]);
                toast.success("Candidate added successfully!");
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Candidates;
