import { useState } from "react";
import api from "../../store/axios.js";
import { toast } from "react-toastify";

const ElectionFormModal = ({ election, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: election?.title || "",
    category: election?.category || "PANCHAYAT",
    description: election?.description || "",
    thumbnail: election?.thumbnail || "",
    startDate: election?.startDate?.slice(0, 10) || "",
    endDate: election?.endDate?.slice(0, 10) || "",
  });

  const handleSubmit = async () => {
    if (!form.title || !form.category || !form.startDate || !form.endDate) {
      toast.error("Title, category, start date and end date are required");
      return;
    }

    if (new Date(form.startDate) >= new Date(form.endDate)) {
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
          className="w-full border px-4 py-2 rounded-lg mb-5"
          value={form.endDate}
          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
        />

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
