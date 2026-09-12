import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Award, AlertTriangle, X, ChevronRight } from "lucide-react";
import api from "../store/axios";
import CandidateFormModal from "../components/Candidate/CandidateFormModal";
import { toast } from "react-toastify";

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [elections, setElections] = useState([]);
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [candidatesRes, electionsRes, userRes] = await Promise.all([
          api.get("/candidates"),
          api.get("/elections"),
          api.get("/voters/me").catch(() => ({ data: null })),
        ]);
        setCandidates(candidatesRes.data || []);
        setElections(electionsRes.data || []);
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

  const handleVote = (candidateId) => {
    const candidate = candidates.find((c) => c._id === candidateId);
    if (!candidate) return;

    // Find LIVE elections for this candidate
    const liveElections = elections.filter(
      (e) =>
        e.status === "LIVE" &&
        e.candidates &&
        e.candidates.some((c) => c === candidateId || c._id === candidateId)
    );

    if (liveElections.length === 0) {
      toast.info("No active elections for this candidate at the moment");
      return;
    }

    // Navigate to the first LIVE election's voting page
    navigate(`/elections/${liveElections[0]._id}`);
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
                  onClick={() => setSelectedCandidate(c)}
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

      {/* Candidate Profile Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl animate-slide-up">
            {/* Close Button */}
            <div className="sticky top-0 bg-inherit rounded-t-2xl p-4 sm:p-6 flex items-center justify-between border-b border-amber-900/10 backdrop-blur-sm z-10">
              <h2 className="text-2xl font-bold">{selectedCandidate.fullName}</h2>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="p-2 hover:bg-surface rounded-lg transition"
              >
                <X size={24} className="text-text-muted" />
              </button>
            </div>

            {/* Profile Content */}
            <div className="p-4 sm:p-6 space-y-6">
              {/* Profile Photo */}
              <div className="flex justify-center">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-4xl sm:text-5xl flex-shrink-0 overflow-hidden">
                  {selectedCandidate.image && selectedCandidate.image.trim() ? (
                    <img
                      src={selectedCandidate.image}
                      alt={selectedCandidate.fullName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <span>
                      {selectedCandidate.fullName
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  )}
                </div>
              </div>

              {/* Basic Info */}
              <div className="space-y-3 text-center sm:text-left">
                <p className="text-lg text-amber-500 font-medium flex items-center gap-2 justify-center sm:justify-start">
                  <Award size={18} />
                  {selectedCandidate.party}
                </p>

                {selectedCandidate.symbol && (
                  <p className="text-sm text-text-muted">
                    <span className="font-medium">Symbol:</span> {selectedCandidate.symbol}
                  </p>
                )}

                {(selectedCandidate.age || selectedCandidate.gender) && (
                  <div className="flex flex-col sm:flex-row gap-4 text-sm text-text-muted">
                    {selectedCandidate.age && (
                      <span>
                        <span className="font-medium">Age:</span> {selectedCandidate.age} years
                      </span>
                    )}
                    {selectedCandidate.gender && (
                      <span>
                        <span className="font-medium">Gender:</span> {selectedCandidate.gender}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-amber-900/10"></div>

              {/* Detailed Information */}
              <div className="space-y-4">
                {selectedCandidate.motto && (
                  <div>
                    <h3 className="font-semibold text-text mb-2">Motto</h3>
                    <p className="text-text-soft">{selectedCandidate.motto}</p>
                  </div>
                )}

                {selectedCandidate.goodWorks && (
                  <div>
                    <h3 className="font-semibold text-text mb-2">Development Works</h3>
                    <p className="text-text-soft">{selectedCandidate.goodWorks}</p>
                  </div>
                )}

                {selectedCandidate.experience && (
                  <div>
                    <h3 className="font-semibold text-text mb-2">Experience</h3>
                    <p className="text-text-soft">{selectedCandidate.experience}</p>
                  </div>
                )}

                {selectedCandidate.education && (
                  <div>
                    <h3 className="font-semibold text-text mb-2">Education</h3>
                    <p className="text-text-soft">{selectedCandidate.education}</p>
                  </div>
                )}

                {selectedCandidate.address?.village && (
                  <div>
                    <h3 className="font-semibold text-text mb-2">Location</h3>
                    <p className="text-text-soft">
                      {selectedCandidate.address.village}
                      {selectedCandidate.address.district && `, ${selectedCandidate.address.district}`}
                      {selectedCandidate.address.state && `, ${selectedCandidate.address.state}`}
                    </p>
                  </div>
                )}

                {selectedCandidate.mobileNumber && (
                  <div>
                    <h3 className="font-semibold text-text mb-2">Mobile</h3>
                    <p className="text-text-soft">{selectedCandidate.mobileNumber}</p>
                  </div>
                )}

                {selectedCandidate.email && (
                  <div>
                    <h3 className="font-semibold text-text mb-2">Email</h3>
                    <p className="text-text-soft">{selectedCandidate.email}</p>
                  </div>
                )}

                {selectedCandidate.fatherName && (
                  <div>
                    <h3 className="font-semibold text-text mb-2">Father's Name</h3>
                    <p className="text-text-soft">{selectedCandidate.fatherName}</p>
                  </div>
                )}

                {selectedCandidate.motherName && (
                  <div>
                    <h3 className="font-semibold text-text mb-2">Mother's Name</h3>
                    <p className="text-text-soft">{selectedCandidate.motherName}</p>
                  </div>
                )}

                {selectedCandidate.spouseName && (
                  <div>
                    <h3 className="font-semibold text-text mb-2">Spouse's Name</h3>
                    <p className="text-text-soft">{selectedCandidate.spouseName}</p>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-amber-900/10"></div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setSelectedCandidate(null);
                    handleVote(selectedCandidate._id);
                  }}
                  className="btn-primary flex-1 py-3 flex items-center justify-center gap-2"
                >
                  Vote for {selectedCandidate.fullName.split(" ")[0]}
                  <ChevronRight size={18} />
                </button>
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="btn-secondary flex-1 py-3"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
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
