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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [electionRes, candidatesRes] = await Promise.all([
          api.get(`/elections/${id}`),
          api.get(`/elections/${id}/candidates`),
        ]);

        setElection(electionRes.data);
        setCandidates(candidatesRes.data || []);

        // Check if user has voted in this election
        const meRes = await api.get("/voters/me");
        if (meRes.data?.votedElections?.includes(id)) {
          setHasVoted(true);
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

      // Refresh candidates to show updated vote counts
      const res = await api.get(`/elections/${id}/candidates`);
      setCandidates(res.data || []);
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
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <Users size={40} className="mx-auto text-text-muted mb-4 opacity-50" />
            <p className="text-text-muted">No candidates for this election yet</p>
          </div>
        )}
      </div>

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
