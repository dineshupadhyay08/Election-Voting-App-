import { useState, useEffect } from "react";
import api from "../../store/axios.js";
import { toast } from "react-toastify";

const ElectionFormModal = ({ election, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [allCandidates, setAllCandidates] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);

  const [form, setForm] = useState({
    title: election?.title || "",
    category: election?.category || "PANCHAYAT",
    description: election?.description || "",
    thumbnail: election?.thumbnail || "",
    startDate: election?.startDate?.slice(0, 10) || "",
    endDate: election?.endDate?.slice(0, 10) || "",
    candidates: election?.candidates || [],
  });

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await api.get("/candidates");
        setAllCandidates(res.data);
        setSelectedCandidates([...new Set(election?.candidates || [])]);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };
    fetchCandidates();
  }, [election]);

  const handleSubmit = async () => {
    if (!form.title || !form.category || !form.startDate || !form.endDate) {
      toast.error("Title, category, start date and end date are required");
      return;
    }

    // Fix date comparison by setting time to midnight to avoid timezone issues
    const startDate = new Date(form.startDate + "T00:00:00");
    const endDate = new Date(form.endDate + "T00:00:00");

    if (startDate >= endDate) {
      toast.error("End date must be after start date");
      return;
    }

    setLoading(true);
    try {
      if (election) {
        await api.patch(`/elections/${election._id}`, form);
        toast.success("Election updated");
      } else {
        await api.post("/elections", form);
        toast.success("Election created");
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving election:", error);
      toast.error(error.response?.data?.message || "Failed to save election");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
        <h3 className="text-lg font-semibold mb-4">
          {election ? "Edit Election" : "Add Election"}
        </h3>

        {/* TITLE */}
        <input
          className="w-full border px-4 py-2 rounded-lg mb-3"
          placeholder="Election title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        {/* DESCRIPTION */}
        <textarea
          className="w-full border px-4 py-2 rounded-lg mb-3"
          placeholder="Description (optional)"
          rows="3"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        {/* CATEGORY */}
        <select
          className="w-full border px-4 py-2 rounded-lg mb-3"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="PANCHAYAT">Panchayat</option>
          <option value="WARD">Ward</option>
          <option value="ASSEMBLY">Assembly</option>
          <option value="LOK_SABHA">Lok Sabha</option>
        </select>

        {/* THUMBNAIL */}
        <input
          className="w-full border px-4 py-2 rounded-lg mb-3"
          placeholder="Thumbnail URL (optional)"
          value={form.thumbnail}
          onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
        />

        {/* START DATE */}
        <input
          type="date"
          className="w-full border px-4 py-2 rounded-lg mb-3"
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
        />

        {/* END DATE */}
        <input
          type="date"
          className="w-full border px-4 py-2 rounded-lg mb-3"
          value={form.endDate}
          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
        />

        {/* CANDIDATES */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Candidates
          </label>
          <div className="max-h-40 overflow-y-auto border rounded-lg p-3">
            {allCandidates.map((candidate) => (
              <label
                key={candidate._id}
                className="flex items-center gap-2 mb-2"
              >
                <input
                  type="checkbox"
                  checked={selectedCandidates.includes(candidate._id)}
                  onChange={(e) => {
                    const newSelected = e.target.checked
                      ? [...new Set([...selectedCandidates, candidate._id])]
                      : selectedCandidates.filter((id) => id !== candidate._id);
                    setSelectedCandidates(newSelected);
                    setForm({ ...form, candidates: newSelected });
                  }}
                  className="rounded"
                />
                <span className="text-sm">
                  {candidate.fullName} ({candidate.party})
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="border px-4 py-2 rounded-lg">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ElectionFormModal;
