import { useState, useEffect } from "react";
import { Loader, Search } from "lucide-react";
import api from "../../store/axios";
import { toast } from "react-toastify";

const AdminVoters = () => {
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchVoters();
  }, []);

  const fetchVoters = async () => {
    setLoading(true);
    try {
      const res = await api.get("/voters");
      setVoters(res.data);
    } catch (err) {
      toast.error("Failed to load voters");
    } finally {
      setLoading(false);
    }
  };

  const filteredVoters = voters.filter(v =>
    v.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text)]">Voters</h1>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
            <input
                type="text"
                placeholder="Search by name or email..."
                className="input pl-10"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      <div className="card p-6">
        {loading ? (
            <div className="flex justify-center p-8"><Loader className="animate-spin text-[var(--brand-primary)]" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead><tr className="border-b border-[var(--divider)] text-[var(--text-soft)]">
                    <th className="text-left p-3">Name</th>
                    <th className="text-left p-3">Email</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Voting Activity</th>
                </tr></thead>
                <tbody className="text-[var(--text)]">
                    {filteredVoters.map(v => (
                        <tr key={v._id} className="border-b border-[var(--divider)]">
                            <td className="p-3">{v.fullName}</td>
                            <td className="p-3">{v.email}</td>
                            <td className="p-3">
                                {v.voted ? (
                                    <span className="badge-success">Voted</span>
                                ) : (
                                    <span className="text-[var(--text-soft)]">Not Voted</span>
                                )}
                            </td>
                            <td className="p-3">
                                {v.votingActivity.length > 0 ? (
                                    <ul className="list-disc pl-4">
                                        {v.votingActivity.map((act, i) => (
                                            <li key={i}>{act.election} &rarr; {act.candidate}</li>
                                        ))}
                                    </ul>
                                ) : "—"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVoters;
