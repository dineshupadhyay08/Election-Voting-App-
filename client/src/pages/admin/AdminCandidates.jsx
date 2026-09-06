import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Plus, Edit2, Trash2, Loader, Upload } from "lucide-react";
import api from "../../store/axios";
import { toast } from "react-toastify";

const AdminCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", gender: "Male", age: "", mobileNumber: "", party: "", motto: "", address: { village: "" }, election: "" });
  const [editingId, setEditingId] = useState(null);
  const [elections, setElections] = useState([]);

  useEffect(() => {
    fetchCandidates();
    fetchElections();
  }, []);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const res = await api.get("/candidates");
      setCandidates(res.data);
    } catch (err) { toast.error("Failed to load candidates"); }
    finally { setLoading(false); }
  };

  const fetchElections = async () => {
    try {
      const res = await api.get("/elections");
      setElections(res.data);
    } catch (err) { toast.error("Failed to load elections"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.patch(`/candidates/${editingId}`, formData);
        toast.success("Candidate updated");
      } else {
        await api.post("/candidates", formData);
        toast.success("Candidate added");
      }
      setIsModalOpen(false);
      setEditingId(null);
      fetchCandidates();
    } catch (err) { toast.error("Operation failed"); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      await api.delete(`/candidates/${id}`);
      setCandidates(candidates.filter(c => c._id !== id));
      toast.success("Candidate removed");
    } catch (err) { toast.error("Failed to remove"); }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const data = new FormData();
    data.append("file", file);
    try {
        const res = await api.post("/upload", data);
        setFormData({...formData, image: res.data.url });
        toast.success("Image uploaded");
    } catch (err) { toast.error("Upload failed"); }
  };

  const Modal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[var(--modal-overlay)] backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
      <div className="bg-[var(--surface)] p-6 rounded-lg w-full max-w-lg border border-[var(--surface-border)] relative z-10">
        <h2 className="text-xl font-bold mb-4 text-[var(--text)]">{editingId ? "Edit" : "Add"} Candidate</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Full Name" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="input col-span-2" required />
            <input type="number" placeholder="Age" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="input" required />
            <input type="text" placeholder="Mobile" value={formData.mobileNumber} onChange={e => setFormData({...formData, mobileNumber: e.target.value})} className="input" required />
            <input type="text" placeholder="Party" value={formData.party} onChange={e => setFormData({...formData, party: e.target.value})} className="input" required />
            <input type="text" placeholder="Village" value={formData.address?.village} onChange={e => setFormData({...formData, address: {...formData.address, village: e.target.value}})} className="input" required />
            <input type="file" onChange={handleImageUpload} className="input col-span-2" />
            <select value={formData.election} onChange={e => setFormData({...formData, election: e.target.value})} className="input col-span-2" required>
              <option value="">Select Election</option>
              {elections.map(e => <option key={e._id} value={e._id}>{e.title}</option>)}
            </select>
            <div className="col-span-2 flex justify-end gap-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">Save</button>
            </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[var(--text)]">Candidates</h1>
        <button onClick={() => { setEditingId(null); setIsModalOpen(true); }} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Candidate
        </button>
      </div>

      {isModalOpen && createPortal(<Modal />, document.body)}

      <div className="card p-6">
        {loading ? (
            <div className="card p-8 animate-pulse space-y-4">
                <div className="h-6 bg-[var(--divider)] rounded w-1/4"></div>
                <div className="h-32 bg-[var(--divider)] rounded"></div>
            </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--divider)]">
                <th className="text-left p-3 text-[var(--text-soft)]">Name</th>
                <th className="text-left p-3 text-[var(--text-soft)]">Party</th>
                <th className="text-left p-3 text-[var(--text-soft)]">Election</th>
                <th className="text-left p-3 text-[var(--text-soft)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((c) => (
                <tr key={c._id} className="border-b border-[var(--divider)]">
                  <td className="p-3 text-[var(--text)]">{c.fullName}</td>
                  <td className="p-3 text-[var(--text)]">{c.party}</td>
                  <td className="p-3 text-[var(--text)]">{c.election?.title || "N/A"}</td>
                  <td className="p-3 flex gap-2">
                    <button onClick={() => { setEditingId(c._id); setFormData(c); setIsModalOpen(true); }} className="btn-ghost p-1"><Edit2 size={16}/></button>
                    <button onClick={() => handleDelete(c._id)} className="btn-ghost text-[var(--status-error)] p-1"><Trash2 size={16}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminCandidates;
