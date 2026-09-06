import { useState, useEffect } from "react";
import { Loader, BarChart2 } from "lucide-react";
import api from "../../store/axios";
import { toast } from "react-toastify";

const AdminResults = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedElection, setSelectedElection] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    setLoading(true);
    try {
      const res = await api.get("/elections");
      setElections(res.data);
    } catch (err) { toast.error("Failed to load elections"); }
    finally { setLoading(false); }
  };

  const fetchAnalytics = async (id) => {
      try {
          const res = await api.get(`/elections/${id}/analytics`);
          setAnalytics(res.data);
          setSelectedElection(id);
      } catch (err) { toast.error("Failed to load analytics"); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text)]">Election Results</h1>
      <div className="card p-6">
        {loading ? (
            <div className="flex justify-center p-8 card animate-pulse">
                <Loader className="animate-spin text-[var(--brand-primary)]" />
            </div>
        ) : elections.length === 0 ? (
            <div className="text-center p-8 text-[var(--text-soft)]">No elections found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--divider)] text-[var(--text-soft)]">
                <th className="text-left p-3">Title</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text)]">
              {elections.map((e) => (
                <tr key={e._id} className="border-b border-[var(--divider)]">
                  <td className="p-3">{e.title}</td>
                  <td className="p-3">
                    <button onClick={() => fetchAnalytics(e._id)} className="btn-ghost p-1"><BarChart2 size={16}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {analytics && (
        <div className="card p-6 mt-6">
           <h2 className="text-xl font-bold mb-4 text-[var(--text)]">{analytics.election.title} Results</h2>
           <p className="text-[var(--text-soft)]">Total Votes: <span className="font-bold text-[var(--text)]">{analytics.election.totalVotes}</span></p>
           <table className="w-full mt-4 text-[var(--text)]">
               <thead><tr className="border-b border-[var(--divider)] text-[var(--text-soft)]"><th className="text-left p-2">Candidate</th><th className="text-left p-2">Votes</th></tr></thead>
               <tbody>
                  {analytics.candidates.map(c => (
                      <tr key={c.id} className="border-b border-[var(--divider)]">
                          <td className="p-2">{c.name}</td>
                          <td className="p-2">{c.votes}</td>
                      </tr>
                  ))}
               </tbody>
           </table>
        </div>
      )}
    </div>
  );
};

export default AdminResults;

