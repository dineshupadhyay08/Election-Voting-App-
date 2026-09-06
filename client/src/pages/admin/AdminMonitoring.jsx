import { useState, useEffect } from "react";
import { Loader, Activity, Clock } from "lucide-react";
import api from "../../store/axios";
import { toast } from "react-toastify";

const AdminMonitoring = () => {
    const [elections, setElections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLiveElections = async () => {
            try {
                const { data } = await api.get("/elections?status=LIVE");
                setElections(data);
            } catch (err) { toast.error("Failed to fetch live elections"); }
            finally { setLoading(false); }
        };
        fetchLiveElections();
        const interval = setInterval(fetchLiveElections, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-[var(--text)] flex items-center gap-2">
                <Activity className="text-[var(--status-error)]" /> Live Election Monitoring
            </h1>

            {loading ? (
                <div className="card p-8 animate-pulse space-y-4">
                    <div className="h-20 bg-[var(--divider)] rounded"></div>
                    <div className="h-20 bg-[var(--divider)] rounded"></div>
                </div>
            ) : (
                <div className="grid gap-4">
                    {elections.length === 0 ? (
                        <div className="card p-8 text-center text-[var(--text-soft)]">
                            No live elections currently.
                        </div>
                    ) : (
                        elections.map(election => (
                            <div key={election._id} className="card p-6 flex justify-between items-center hover:border-[var(--brand-primary)] transition">
                                <div>
                                    <h3 className="text-lg font-bold text-[var(--text)]">{election.title}</h3>
                                    <p className="text-sm text-[var(--text-muted)]">
                                        Status: <span className="text-[var(--status-success)] font-semibold">LIVE</span>
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-[var(--text)]">{election.voters?.length || 0} Votes Cast</p>
                                    <p className="text-sm text-[var(--text-muted)] flex items-center gap-1 justify-end">
                                        <Clock size={14} /> Ends: {new Date(election.endDate).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminMonitoring;

