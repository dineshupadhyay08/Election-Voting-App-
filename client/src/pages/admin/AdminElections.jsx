import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Plus, Edit2, Trash2, Loader, Search, Filter } from "lucide-react";
import api from "../../store/axios";
import { toast } from "react-toastify";

const AdminElections = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: "", description: "", category: "PANCHAYAT", startDate: "", endDate: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    setLoading(true);
    try {
      const res = await api.get("/elections");
      setElections(res.data);
    } catch (err) {
      toast.error("Failed to load elections");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.patch(`/elections/${editingId}`, formData);
        toast.success("Election updated");
      } else {
        await api.post("/elections", formData);
        toast.success("Election created");
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ title: "", description: "", category: "PANCHAYAT", startDate: "", endDate: "" });
      fetchElections();
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  const openModal = (election = null) => {
    if (election) {
      setEditingId(election._id);
      setFormData({
        title: election.title,
        description: election.description || "",
        category: election.category,
        startDate: election.startDate?.split("T")[0],
        endDate: election.endDate?.split("T")[0]
      });
    } else {
      setEditingId(null);
      setFormData({ title: "", description: "", category: "PANCHAYAT", startDate: "", endDate: "" });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (e) => {
    if (e.voters?.length > 0) {
        toast.error("Cannot delete election with votes cast.");
        return;
    }
    if (!confirm("Are you sure?")) return;
    try {
      await api.delete(`/elections/${e._id}`);
      setElections(elections.filter(election => election._id !== e._id));
      toast.success("Election deleted");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const toggleActive = async (e) => {
      try {
          await api.patch(`/elections/${e._id}`, { isActive: !e.isActive });
          fetchElections();
          toast.success("Election status updated");
      } catch (err) { toast.error("Failed to update status"); }
  }

  // Moved Modal component definition OUTSIDE of the render loop to prevent re-creation
  const ElectionModal = ({ isOpen, onClose, formData, setFormData, handleSubmit, editingId }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[var(--modal-overlay)] backdrop-blur-sm" onClick={onClose} />
        <div className="bg-[var(--surface)] p-6 rounded-lg w-full max-w-md border border-[var(--surface-border)] relative z-10">
          <h2 className="text-xl font-bold mb-4 text-text">{editingId ? "Edit" : "New"} Election</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="input" required />
            <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="input textarea" />
            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="input" required>
              <option value="PANCHAYAT">Panchayat</option>
              <option value="GENERAL">General</option>
            </select>
            <input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="input" required />
            <input type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="input" required />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">Save</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text">Elections</h1>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> New Election
        </button>
      </div>

      {isModalOpen && createPortal(
        <ElectionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          editingId={editingId}
        />,
        document.body
      )}

      <div className="card p-6">
        {loading ? (
            <div className="card p-8 animate-pulse space-y-4">
                <div className="h-6 bg-[var(--surface-border)] rounded w-1/4"></div>
                <div className="h-32 bg-[var(--surface-border)] rounded"></div>
            </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--divider)]">
                <th className="text-left p-3 text-text-soft">Title</th>
                <th className="text-left p-3 text-text-soft">Status</th>
                <th className="text-left p-3 text-text-soft">Candidates</th>
                <th className="text-left p-3 text-text-soft">Actions</th>
              </tr>
            </thead>
            <tbody>
              {elections.map((e) => (
                <tr key={e._id} className="border-b border-[var(--divider)]">
                  <td className="p-3 text-text">{e.title}</td>
                  <td className="p-3">
                    <button onClick={() => toggleActive(e)} className={e.isActive ? "badge-success" : "chip"}>
                        {e.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="p-3 text-text">{e.candidates?.length || 0}</td>
                  <td className="p-3 flex gap-2">
                    <button onClick={() => openModal(e)} className="btn-ghost p-1"><Edit2 size={16}/></button>
                    <button onClick={() => handleDelete(e)} className="btn-ghost text-red-500 p-1"><Trash2 size={16}/></button>
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

export default AdminElections;
