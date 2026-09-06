import { useState, useEffect } from "react";
import { Loader } from "lucide-react";
import api from "../store//axios.js";
import { toast } from "react-toastify";

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get("/dashboard/overview");
                setStats(data.stats);
            } catch (err) {
                setError("Failed to load dashboard statistics");
                toast.error("Failed to load dashboard statistics");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="card p-8 animate-pulse space-y-4">
            <div className="h-6 bg-[var(--surface-border)] rounded w-1/4"></div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-24 bg-[var(--surface-border)] rounded"></div>
                ))}
            </div>
        </div>
    );
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-[var(--text)]">Good morning, Admin</h1>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="card p-6">
                    <p className="text-sm text-[var(--text-muted)]">Live Elections</p>
                    <p className="text-3xl font-bold text-[var(--status-error)]">{stats.liveElections}</p>
                </div>
                <div className="card p-6">
                    <p className="text-sm text-[var(--text-muted)]">Upcoming Elections</p>
                    <p className="text-3xl font-bold text-[var(--text)]">{stats.upcomingElections}</p>
                </div>
                <div className="card p-6">
                    <p className="text-sm text-[var(--text-muted)]">Total Candidates</p>
                    <p className="text-3xl font-bold text-[var(--text)]">{stats.totalCandidates}</p>
                </div>
                <div className="card p-6">
                    <p className="text-sm text-[var(--text-muted)]">Total Votes</p>
                    <p className="text-3xl font-bold text-[var(--text)]">{stats.votesCast}</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
