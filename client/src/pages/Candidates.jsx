import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Award, AlertTriangle } from "lucide-react";
import api from "../store/axios";
import CandidateFormModal from "../components/Candidate/CandidateFormModal";
import { toast } from "react-toastify";

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [candidatesRes, userRes] = await Promise.all([
          api.get("/candidates"),
          api.get("/voters/me").catch(() => ({ data: null })),
        ]);
        setCandidates(candidatesRes.data || []);
        setUser(userRes.data);
      } catch (err) {
        toast.error("Failed to load candidates");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleVote = (id) => {
    toast.success(`Vote submitted for ${id}`);
  };

  const handleDelete = (id) => {
    const candidate = candidates.find((c) => c._id === id);
    setCandidateToDelete(candidate);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (candidateToDelete) {
      try {
        await api.delete(`/candidates/${candidateToDelete._id}`);
        setCandidates((prev) =>
          prev.filter((c) => c._id !== candidateToDelete._id),
        );
        toast.success("Candidate deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete candidate");
      }
    }
    setShowDeleteConfirm(false);
    setCandidateToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setCandidateToDelete(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Candidates</h1>
          <p className="mt-1 text-text-muted">Select your candidate and make your vote count</p>
        </div>

        {user?.isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2 w-fit"
          >
            <span>+</span>
            Add Candidate
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="card p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto"></div>
          <p className="text-text-muted mt-4">Loading candidates...</p>
        </div>
      )}

      {/* Candidates Grid */}
      {!loading && candidates.length > 0 && (
        <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {candidates.map((c) => (
            <div
              key={c._id}
              className="card p-4 sm:p-5 flex flex-col hover:shadow-lg transition-all duration-300"
            >
              {/* IMAGE CONTAINER */}
              <div className="mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-amber-400 to-amber-600 flex-shrink-0 h-32 sm:h-40 flex items-center justify-center">
                {c.image && c.image.trim() ? (
                  <img
                    src={c.image}
                    alt={c.fullName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <span className="text-white font-bold text-2xl sm:text-3xl">
                    {c.fullName
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
                )}
              </div>

              {/* INFO */}
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold line-clamp-2">
                  {c.fullName}
                </h3>

                <div className="flex items-center gap-2 text-xs sm:text-sm text-text-muted mt-1.5">
                  <Award size={14} className="text-amber-500 flex-shrink-0" />
                  <span className="truncate">{c.party}</span>
                </div>

                {c.age && (
                  <p className="text-xs sm:text-sm text-text-muted mt-1.5">
                    Age {c.age}
                  </p>
                )}
              </div>

              {/* BUTTONS */}
              <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={() => navigate(`/candidates/${c._id}`)}
                  className="btn-secondary flex-1 py-2 text-xs sm:text-sm"
                >
                  View Profile
                </button>

                <button
                  onClick={() => handleVote(c._id)}
                  className="btn-primary flex-1 py-2 text-xs sm:text-sm"
                >
                  Vote
                </button>
              </div>

              {/* ADMIN BUTTONS */}
              {user?.isAdmin && (
                <div className="flex gap-2 mt-3 pt-3 border-t border-amber-900/10">
                  <button
                    onClick={() => {
                      setEditingCandidate(c);
                      setShowModal(true);
                    }}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm py-1.5 rounded-md font-medium transition-colors"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(c._id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm py-1.5 rounded-md font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && candidates.length === 0 && (
        <div className="card p-12 text-center">
          <Award size={40} className="mx-auto text-text-muted mb-4 opacity-50" />
          <h3 className="text-lg font-semibold">No candidates yet</h3>
          <p className="mt-2 text-text-muted">
            Check back later or add candidates if you're an admin
          </p>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <CandidateFormModal
          candidate={editingCandidate}
          onClose={() => {
            setShowModal(false);
            setEditingCandidate(null);
          }}
          onSuccess={(newCandidate) => {
            if (editingCandidate) {
              setCandidates((prev) =>
                prev.map((c) =>
                  c._id === newCandidate._id ? newCandidate : c,
                ),
              );
              toast.success("Candidate updated successfully!");
            } else {
              setCandidates((prev) => [newCandidate, ...prev]);
              toast.success("Candidate added successfully!");
            }
            setEditingCandidate(null);
          }}
        />
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteConfirm && candidateToDelete && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"></div>

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="card w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-lg">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle size={20} className="text-red-500" />
                Delete Candidate
              </h3>

              <p className="text-text-muted mb-6">
                Are you sure you want to delete{" "}
                <strong>{candidateToDelete.fullName}</strong>? This action
                cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  className="btn-secondary flex-1 py-2"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Candidates;
