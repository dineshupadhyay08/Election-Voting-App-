import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Filter, Search, Vote, CalendarClock, CheckCircle2, AlertTriangle, Loader } from "lucide-react";
import api from "../store/axios.js";
import { useAuth } from "../context/AuthContext";

const Elections = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("");

  const fetchElections = async () => {
    try {
      setLoading(true);
      setError("");
      const params = {};
      if (statusFilter !== "ALL") params.status = statusFilter;
      if (categoryFilter) params.category = categoryFilter;

      const res = await api.get("/elections", { params });
      setElections(res.data || []);
    } catch (err) {
      setError("Failed to load elections");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElections();
  }, [statusFilter, categoryFilter]);

  const filteredElections = elections.filter((e) =>
    e.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "LIVE":
        return <span className="badge-live">● LIVE</span>;
      case "UPCOMING":
        return <span className="badge-warning">Upcoming</span>;
      case "COMPLETED":
      case "ENDED":
        return <span className="badge-success">Ended</span>;
      default:
        return <span className="badge-info">{status}</span>;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "LIVE":
        return <Vote size={18} className="text-red-500" />;
      case "UPCOMING":
        return <CalendarClock size={18} className="text-amber-500" />;
      case "COMPLETED":
      case "ENDED":
        return <CheckCircle2 size={18} className="text-green-500" />;
      default:
        return <AlertTriangle size={18} className="text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Elections</h1>
          <p className="mt-1 text-text-muted">Browse and participate in active elections</p>
        </div>
        {user?.isAdmin && (
          <button
            onClick={() => navigate("/admin/elections")}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Manage Elections
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search elections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input px-3 min-w-max"
          >
            <option value="ALL">All Status</option>
            <option value="LIVE">Live</option>
            <option value="UPCOMING">Upcoming</option>
            <option value="ENDED">Ended</option>
          </select>

          {/* Refresh */}
          <button
            onClick={fetchElections}
            disabled={loading}
            className="btn-secondary px-4"
          >
            {loading ? <Loader size={18} className="animate-spin" /> : <Filter size={18} />}
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="card p-4 flex items-center gap-3 bg-red-500/10 border border-red-500/20">
          <AlertTriangle size={20} className="text-red-500 flex-shrink-0" />
          <div>
            <p className="font-medium text-red-600">{error}</p>
            <button onClick={fetchElections} className="text-sm text-red-500 hover:text-red-600 mt-1">
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader size={32} className="animate-spin text-amber-500 mx-auto mb-4" />
            <p className="text-text-muted">Loading elections...</p>
          </div>
        </div>
      )}

      {/* Elections Grid */}
      {!loading && filteredElections.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredElections.map((election) => (
            <button
              key={election._id || election.id}
              onClick={() => navigate(`/elections/${election._id || election.id}`)}
              className="card p-5 hover:shadow-lg transition-all duration-300 text-left group"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>{getStatusBadge(election.status)}</div>
                {getStatusIcon(election.status)}
              </div>

              <h3 className="font-semibold text-lg group-hover:text-amber-500 transition line-clamp-2">
                {election.title}
              </h3>

              <p className="mt-2 text-sm text-text-muted line-clamp-2">
                {election.description}
              </p>

              <div className="mt-4 pt-4 border-t border-amber-900/10 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-text-muted">Category</span>
                  <span className="font-medium">{election.category || "General"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Candidates</span>
                  <span className="font-medium">{election.candidatesCount || 0}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-amber-900/10">
                <p className="text-xs text-amber-500 font-medium group-hover:text-amber-600 transition">
                  {election.status === "LIVE"
                    ? "Vote Now →"
                    : election.status === "UPCOMING"
                    ? "View Details →"
                    : "View Results →"}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredElections.length === 0 && (
        <div className="card p-12 text-center">
          <Vote size={48} className="mx-auto text-text-muted mb-4 opacity-50" />
          <h3 className="text-lg font-semibold">No elections found</h3>
          <p className="mt-2 text-text-muted">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Check back later for new elections"}
          </p>
        </div>
      )}
    </div>
  );
};

export default Elections;
