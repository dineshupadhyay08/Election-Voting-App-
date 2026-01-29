import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../store/axios.js";
import { toast } from "react-toastify";

const ElectionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchElection = async () => {
      try {
        console.log("Fetching election with ID:", id);
        const [electionRes, candidatesRes] = await Promise.all([
          api.get(`/elections/${id}`),
          api.get(`/candidates?electionId=${id}`),
        ]);

        console.log("Election data:", electionRes.data);
        console.log("Candidates data:", candidatesRes.data);

        setElection(electionRes.data);
        setCandidates(candidatesRes.data);
      } catch (error) {
        console.error("Error fetching election details:", error);
        toast.error(
          "Error loading election details. Please check the console for details.",
        );
      } finally {
        setLoading(false);
      }
    };

    const checkAdmin = async () => {
      try {
        const res = await api.get("/voters/me");
        setIsAdmin(res.data.isAdmin);
      } catch (error) {
        setIsAdmin(false);
      }
    };

    if (id) {
      fetchElection();
      checkAdmin();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading election details...</div>
      </div>
    );
  }

  if (!election) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-600">Election not found</div>
      </div>
    );
  }

  const totalVotes = candidates.reduce((sum, c) => sum + (c.voteCount || 0), 0);
  const totalVoters = election.voters?.length || 0;
  const voterTurnout =
    totalVoters > 0 ? Math.round((totalVotes / totalVoters) * 100) : 0;

  const sortedCandidates = [...candidates].sort(
    (a, b) => (b.voteCount || 0) - (a.voteCount || 0),
  );
  const maxVotes = Math.max(...candidates.map((c) => c.voteCount || 0));

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* HEADER */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {election.thumbnail && (
              <img
                src={election.thumbnail}
                alt={election.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                {election.status === "LIVE" && (
                  <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                )}
                <span
                  className={election.status === "LIVE" ? "text-green-600" : ""}
                >
                  {election.title}
                </span>
              </h1>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600">{totalVotes}</p>
            <p className="text-sm text-gray-600">Total Votes</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{voterTurnout}%</p>
            <p className="text-sm text-gray-600">Voter Turnout</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {candidates.length}
            </p>
            <p className="text-sm text-gray-600">Candidates</p>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          <p>Start: {new Date(election.startDate).toLocaleString()}</p>
          <p>End: {new Date(election.endDate).toLocaleString()}</p>
        </div>
      </div>

      {/* CANDIDATES LIST */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Candidates</h2>

        <div className="space-y-4">
          {sortedCandidates.map((candidate, index) => {
            const percentage =
              maxVotes > 0
                ? Math.round(((candidate.voteCount || 0) / maxVotes) * 100)
                : 0;

            return (
              <div
                key={candidate._id}
                className="border rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-bold">
                      {index + 1}
                    </div>
                    <img
                      src={candidate.image || "/logo.png"}
                      alt={candidate.fullName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{candidate.fullName}</h3>
                      <p className="text-sm text-gray-600">
                        ({candidate.party})
                      </p>
                      <p className="text-xs text-gray-500">{candidate.motto}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold">
                      {candidate.voteCount || 0}
                    </p>
                    <p className="text-sm text-gray-600">votes</p>
                  </div>
                </div>

                {/* PROGRESS BAR */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {percentage}% of lead
                  </p>
                </div>
              </div>
            );
          })}
        </div>
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
