import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Users,
  Vote,
  CheckCircle2,
  Clock,
  Loader,
  Lock,
  X,
  Info,
} from "lucide-react";
import api from "../store/axios.js";
import { useAuth } from "../context/AuthContext";

const ElectionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasVoted, setHasVoted] = useState(false);
  const [votingCandidateId, setVotingCandidateId] = useState(null);
  const [showVoteConfirm, setShowVoteConfirm] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        setHasVoted(false); // Reset hasVoted on mount/id change

        const [electionRes, candidatesRes] = await Promise.all([
          api.get(`/elections/${id}`),
          api.get(`/elections/${id}/candidates`),
        ]);

        setElection(electionRes.data);
        setCandidates(candidatesRes.data || []);

        // Check if user has voted in this election
        // Convert URL param id to string for comparison (votedElections contains ObjectId strings)
        const meRes = await api.get("/voters/me");
        const hasVotedInElection = meRes.data?.votedElections?.some(
          (electionId) => electionId.toString() === id.toString()
        );

        if (hasVotedInElection) {
          setHasVoted(true);
        } else {
          setHasVoted(false);
        }
      } catch (err) {
        setError("Failed to load election details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleVote = async (candidateId, candidateName) => {
    if (election.status !== "LIVE") {
      alert("Voting is not active for this election");
      return;
    }

    if (hasVoted) {
      alert("You have already voted in this election");
      return;
    }

    setShowVoteConfirm({ candidateId, candidateName });
  };

  const confirmVote = async () => {
    if (!showVoteConfirm) return;

    try {
      setVotingCandidateId(showVoteConfirm.candidateId);
      await api.patch(`/candidates/${showVoteConfirm.candidateId}/vote`);

      setHasVoted(true);
      setShowVoteConfirm(null);
      // Success modal or redirect? Prompt asks for success state.
      // I'll stick to a clearer success banner and state.
    } catch (err) {
      alert(err.response?.data?.message || "Voting failed. Please try again.");
    } finally {
      setVotingCandidateId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "LIVE":
        return <span className="badge-live">● LIVE NOW</span>;
      case "UPCOMING":
        return <span className="badge-warning">Upcoming</span>;
      case "ENDED":
      case "COMPLETED":
        return <span className="badge-success">Ended</span>;
      default:
        return <span className="badge-info">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader size={40} className="animate-spin text-amber-500 mx-auto mb-4" />
          <p className="text-text-muted">Loading election details...</p>
        </div>
      </div>
    );
  }

  if (error || !election) {
    return (
      <div className="card p-8 text-center">
        <AlertTriangle size={40} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">Unable to Load Election</h2>
        <p className="text-text-muted mb-6">{error || "Election not found"}</p>
        <button onClick={() => navigate("/elections")} className="btn-secondary">
          <ArrowLeft size={18} />
          Back to Elections
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back Button */}
      <button
        onClick={() => navigate("/elections")}
        className="btn-ghost mb-4"
      >
        <ArrowLeft size={18} />
        Back to Elections
      </button>

      {/* Header */}
      <div className="card-lg p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>{getStatusBadge(election.status)}</div>
          <div className="text-right text-sm text-text-muted">
            {election.category}
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold mb-4">{election.title}</h1>
        <p className="text-lg text-text-soft mb-6">{election.description}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="glass rounded-xl p-4">
            <div className="text-xs font-semibold uppercase tracking-widest text-text-muted">
              Start
            </div>
            <p className="mt-2 text-sm font-medium">
              {election.startDate
                ? new Date(election.startDate).toLocaleDateString("en-IN")
                : "TBD"}
            </p>
          </div>
          <div className="glass rounded-xl p-4">
            <div className="text-xs font-semibold uppercase tracking-widest text-text-muted">
              End
            </div>
            <p className="mt-2 text-sm font-medium">
              {election.endDate
                ? new Date(election.endDate).toLocaleDateString("en-IN")
                : "TBD"}
            </p>
          </div>
          <div className="glass rounded-xl p-4">
            <div className="text-xs font-semibold uppercase tracking-widest text-text-muted">
              Candidates
            </div>
            <p className="mt-2 text-sm font-medium">{candidates.length}</p>
          </div>
          <div className="glass rounded-xl p-4">
            <div className="text-xs font-semibold uppercase tracking-widest text-text-muted">
              Total Votes
            </div>
            <p className="mt-2 text-sm font-medium">
              {candidates.reduce((sum, c) => sum + (c.voteCount || 0), 0)}
            </p>
          </div>
        </div>

        {/* Voting Status */}
        {hasVoted && (
          <div className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex gap-3">
            <CheckCircle2 size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-green-600">You have already voted</p>
              <p className="text-sm text-green-600/80">
                Your vote has been recorded for this election
              </p>
            </div>
          </div>
        )}

        {election.status !== "LIVE" && (
          <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex gap-3">
            <Clock size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-600">
                {election.status === "UPCOMING"
                  ? "Voting has not started yet"
                  : "Voting has ended"}
              </p>
              <p className="text-sm text-blue-600/80">
                {election.status === "UPCOMING"
                  ? `Voting opens on ${new Date(election.startDate).toLocaleDateString("en-IN")}`
                  : "Results are now available below"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Candidates */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Candidates</h2>
        {candidates.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {candidates.map((candidate) => (
              <div key={candidate._id} className="card p-5 sm:p-6 flex flex-col">
                {/* Candidate Avatar */}
                <div className="mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-xl">
                    {candidate.fullName
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                </div>

                {/* Candidate Info */}
                <h3 className="text-lg font-semibold mb-1">{candidate.fullName}</h3>
                <p className="text-sm text-text-soft mb-2">{candidate.party}</p>

                {candidate.education && (
                  <p className="text-xs text-text-muted mb-3">
                    <span className="font-medium">Education:</span> {candidate.education}
                  </p>
                )}

                {candidate.experience && (
                  <p className="text-xs text-text-muted mb-3 line-clamp-2">
                    <span className="font-medium">Experience:</span> {candidate.experience}
                  </p>
                )}

                {/* Vote Count */}
                <div className="mt-auto pt-4 border-t border-amber-900/10 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-muted">Votes</span>
                    <span className="text-lg font-bold text-amber-500">
                      {candidate.voteCount || 0}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  {/* View Candidate Button */}
                  <button
                    onClick={() => setSelectedCandidate(candidate)}
                    className="btn-secondary w-full py-2 flex items-center justify-center gap-2 text-sm"
                  >
                    <Info size={16} />
                    View Candidate
                  </button>

                  {/* Vote Button */}
                  {election.status === "LIVE" && !hasVoted ? (
                    <button
                      onClick={() =>
                        handleVote(candidate._id, candidate.fullName)
                      }
                      disabled={votingCandidateId === candidate._id}
                      className="btn-primary w-full py-2 flex items-center justify-center gap-2"
                    >
                      {votingCandidateId === candidate._id ? (
                        <>
                          <Loader size={16} className="animate-spin" />
                          Voting...
                        </>
                      ) : (
                        <>
                          <Vote size={16} />
                          Vote
                        </>
                      )}
                    </button>
                  ) : hasVoted ? (
                    <button disabled className="btn-secondary w-full py-2 opacity-50">
                      <Lock size={16} />
                      Already Voted
                    </button>
                  ) : (
                    <button disabled className="btn-secondary w-full py-2 opacity-50">
                      Voting Closed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <Users size={40} className="mx-auto text-text-muted mb-4 opacity-50" />
            <p className="text-text-muted">No candidates for this election yet</p>
          </div>
        )}
      </div>

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 animate-slide-up">
            {/* Close Button */}
            <button
              onClick={() => setSelectedCandidate(null)}
              className="absolute top-4 right-4 p-2 hover:bg-surface rounded-lg transition"
            >
              <X size={24} className="text-text-muted" />
            </button>

            {/* Candidate Header */}
            <div className="flex gap-6 mb-6">
              {/* Profile Photo */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-3xl">
                  {selectedCandidate.fullName
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
              </div>

              {/* Basic Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{selectedCandidate.fullName}</h2>
                <p className="text-lg text-amber-500 font-medium mb-4">{selectedCandidate.party}</p>
                <div className="space-y-2">
                  {selectedCandidate.symbol && (
                    <p className="text-sm text-text-muted">
                      <span className="font-medium">Symbol:</span> {selectedCandidate.symbol}
                    </p>
                  )}
                  {selectedCandidate.age && (
                    <p className="text-sm text-text-muted">
                      <span className="font-medium">Age:</span> {selectedCandidate.age} years
                    </p>
                  )}
                  {selectedCandidate.gender && (
                    <p className="text-sm text-text-muted">
                      <span className="font-medium">Gender:</span> {selectedCandidate.gender}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-surface-border my-6"></div>

            {/* Detailed Information */}
            <div className="space-y-4 mb-6">
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

            {/* Vote Stats */}
            <div className="bg-surface rounded-lg p-4 mb-6">
              <p className="text-sm text-text-muted mb-2">Total Votes Received</p>
              <p className="text-2xl font-bold text-amber-500">{selectedCandidate.voteCount || 0}</p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedCandidate(null)}
              className="btn-secondary w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Vote Confirmation Modal */}
      {showVoteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="card max-w-md w-full p-6 sm:p-8 animate-slide-up">
            <h2 className="text-2xl font-bold mb-2">Confirm Your Vote</h2>
            <p className="text-text-muted mb-6">
              You are about to vote for:
            </p>

            <div className="glass rounded-xl p-4 mb-6">
              <p className="text-lg font-semibold">{showVoteConfirm.candidateName}</p>
              <p className="text-sm text-text-muted mt-1">
                {election.title}
              </p>
            </div>

            <p className="text-sm text-text-muted mb-6">
              <span className="font-medium">⚠️ Important:</span> This action cannot be
              undone. You can only vote once per election.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowVoteConfirm(null)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={confirmVote}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <Vote size={18} />
                Confirm Vote
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElectionDetails;
