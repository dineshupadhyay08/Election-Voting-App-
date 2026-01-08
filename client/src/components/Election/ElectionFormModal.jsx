import { useState } from "react";
import api from "../../store/axios.js";

const ElectionFormModal = ({ election, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title: election?.title || "",
    category: election?.category || "PANCHAYAT",
    startDate: election?.startDate?.slice(0, 10) || "",
    endDate: election?.endDate?.slice(0, 10) || "",
  });

  const handleSubmit = async () => {
    if (election) {
      await api.patch(`/elections/${election._id}`, form);
    } else {
      await api.post("/elections", form);
    }
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          {election ? "Edit Election" : "Add Election"}
        </h3>

        <input
          className="w-full border px-4 py-2 rounded-lg mb-3"
          placeholder="Election title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

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

        <input
          type="date"
          className="w-full border px-4 py-2 rounded-lg mb-3"
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
        />

        <input
          type="date"
          className="w-full border px-4 py-2 rounded-lg mb-4"
          value={form.endDate}
          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="border px-4 py-2 rounded-lg">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ElectionFormModal;
