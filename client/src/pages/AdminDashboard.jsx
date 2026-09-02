import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit2, Trash2, Users, Vote, BarChart3, AlertTriangle, Loader } from "lucide-react";
import api from "../store/axios";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalElections: 0,
    liveElections: 0,
    totalVotes: 0,
    totalCandidates: 0,
  });

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate("/");
      return;
    }

    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const res = await api.get("/elections");
        const allElections = res.data || [];
        setElections(allElections);

        // Calculate stats
        const liveCount = allElections.filter((e) => e.status === "LIVE").length;
        const totalVotes = allElections.reduce((sum, e) => sum + (e.totalVotes || 0), 0);

        setStats({
          totalElections: allElections.length,
          liveElections: liveCount,
          totalVotes,
          totalCandidates: allElections.reduce((sum, e) => sum + (e.candidatesCount || 0), 0),
        });
      } catch (err) {
        setError("Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [user, navigate]);

  const handleDeleteElection = async (electionId) => {
    if (!confirm("Are you sure you want to delete this election?")) return;

    try {
      await api.delete(`/elections/${electionId}`);
      setElections(elections.filter((e) => e._id !== electionId));
    } catch (err) {
      alert("Failed to delete election");
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="card p-8 text-center">
        <AlertTriangle size={40} className="mx-auto text-red-500 mb-4" />
        <p className="text-text-muted">Admin access required</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader size={40} className="animate-spin text-amber-500 mx-auto mb-4" />
          <p className="text-text-muted">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="mt-1 text-text-muted">Manage elections and monitor activity</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          New Election
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-6">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                Total Elections
              </p>
              <p className="text-3xl font-bold mt-2">{stats.totalElections}</p>
            </div>
            <Vote size={24} className="text-amber-500 opacity-50" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                Live Now
              </p>
              <p className="text-3xl font-bold mt-2 text-red-500">
                {stats.liveElections}
              </p>
            </div>
            <div className="badge-live">●</div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                Total Votes
              </p>
              <p className="text-3xl font-bold mt-2">{stats.totalVotes}</p>
            </div>
            <BarChart3 size={24} className="text-amber-500 opacity-50" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                Candidates
              </p>
              <p className="text-3xl font-bold mt-2">{stats.totalCandidates}</p>
            </div>
            <Users size={24} className="text-amber-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Elections Table */}
      <div className="card p-6">
        <h2 className="text-xl font-bold mb-4">Elections</h2>
        {elections.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-amber-900/10">
                  <th className="text-left py-3 px-3 font-semibold text-text-muted">
                    Title
                  </th>
                  <th className="text-left py-3 px-3 font-semibold text-text-muted">
                    Status
                  </th>
                  <th className="text-left py-3 px-3 font-semibold text-text-muted">
                    Candidates
                  </th>
                  <th className="text-left py-3 px-3 font-semibold text-text-muted">
                    Votes
                  </th>
                  <th className="text-left py-3 px-3 font-semibold text-text-muted">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {elections.map((election) => (
                  <tr
                    key={election._id}
                    className="border-b border-amber-900/10 hover:bg-amber-500/5 transition"
                  >
                    <td className="py-3 px-3 font-medium">{election.title}</td>
                    <td className="py-3 px-3">
                      {election.status === "LIVE" && (
                        <span className="badge-live text-xs">● LIVE</span>
                      )}
                      {election.status === "UPCOMING" && (
                        <span className="badge-warning text-xs">Upcoming</span>
                      )}
                      {election.status !== "LIVE" &&
                        election.status !== "UPCOMING" && (
                          <span className="badge-success text-xs">Ended</span>
                        )}
                    </td>
                    <td className="py-3 px-3">{election.candidatesCount || 0}</td>
                    <td className="py-3 px-3">{election.totalVotes || 0}</td>
                    <td className="py-3 px-3">
                      <div className="flex gap-2">
                        <button className="btn-ghost text-xs p-2">
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteElection(election._id)}
                          className="btn-ghost text-xs p-2 text-red-500 hover:bg-red-500/10"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-text-muted py-6">No elections created yet</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
