import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../store/axios.js";
import { toast } from "react-toastify";
import ElectionCandidateCard from "../components/ElectionCandidateCard.jsx";

const ElectionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [voting, setVoting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [electionRes, candidatesRes, meRes] = await Promise.all([
          api.get(`/elections/${id}`),
          api.get(`/candidates?electionId=${id}`),
          api.get("/voters/me"),
        ]);

        setElection(electionRes.data);
        setCandidates(candidatesRes.data);
        setIsAdmin(meRes.data.isAdmin);
      } catch (err) {
        toast.error("Failed to load election details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleVote = async (candidateId) => {
    if (election.status !== "LIVE") {
      toast.error("Voting is not active for this election");
      return;
    }

    if (voting) return;

    setVoting(true);
    try {
      await api.patch(`/candidates/${candidateId}/vote`);
      toast.success("Vote recorded successfully");

      const res = await api.get(`/candidates?electionId=${id}`);
      setCandidates(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Voting failed");
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading election...
      </div>
    );
  }

  if (!election) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600">
        Election not found
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* HEADER */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            {election.thumbnail && (
              <img
                src={election.thumbnail}
                alt={election.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
            )}

            <div>
              <h1 className="text-2xl font-bold">{election.title}</h1>
              <p className="text-gray-600">{election.category}</p>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              election.status === "LIVE"
                ? "bg-green-100 text-green-600"
                : election.status === "UPCOMING"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-600"
            }`}
          >
            {election.status}
          </span>
        </div>

        <div className="text-sm text-gray-500">
          <p>Start: {new Date(election.startDate).toLocaleString()}</p>
          <p>End: {new Date(election.endDate).toLocaleString()}</p>
        </div>
      </div>

      {/* CANDIDATES */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Election Candidates</h2>

        {candidates.length === 0 ? (
          <p className="text-gray-500">
            No candidates assigned to this election.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {candidates.map((candidate) => (
              <ElectionCandidateCard
                key={candidate._id}
                candidate={candidate}
                electionStatus={election.status}
                onVote={handleVote}
              />
            ))}
          </div>
        )}
      </div>

      {/* ADMIN ACTIONS */}
      {isAdmin && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Admin Actions</h2>

          <div className="flex gap-4">
            <button
              onClick={() => navigate(`/elections/${id}/edit`)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
            >
              Edit Election
            </button>

            <button
              onClick={() => {
                if (window.confirm("Delete this election?")) {
                  api.delete(`/elections/${id}`).then(() => {
                    navigate("/elections");
                  });
                }
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Delete Election
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElectionDetails;
