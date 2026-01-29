import { useState } from "react";
import api from "../../store/axios.js";
import { toast } from "react-toastify";

const ElectionFormModal = ({ election, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title: election?.title || "",
    category: election?.category || "PANCHAYAT",
    startDate: election?.startDate?.slice(0, 10) || "",
    endDate: election?.endDate?.slice(0, 10) || "",
    description: election?.description || "",
    thumbnail: election?.thumbnail || "",
  });

  const [inputMethod, setInputMethod] = useState("form"); // "form", "json", "upload"
  const [jsonData, setJsonData] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let dataToSend = form;

      if (inputMethod === "json") {
        try {
          dataToSend = JSON.parse(jsonData);
        } catch (error) {
          toast.error("Invalid JSON format");
          setLoading(false);
          return;
        }
      } else if (inputMethod === "upload" && uploadFile) {
        const fileData = await uploadFile.text();
        try {
          dataToSend = JSON.parse(fileData);
        } catch (error) {
          toast.error("Invalid JSON file");
          setLoading(false);
          return;
        }
      }

      if (election) {
        await api.patch(`/elections/${election._id}`, dataToSend);
      } else {
        await api.post("/elections", dataToSend);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving election:", error);
      toast.error("Error saving election");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">
          {election ? "Edit Election" : "Add Election"}
        </h3>

        {/* Input Method Selector */}
        <div className="mb-4">
          <div className="flex gap-2 mb-3">
            {["form", "json", "upload"].map((method) => (
              <button
                key={method}
                onClick={() => setInputMethod(method)}
                className={`px-3 py-1 rounded text-sm ${
                  inputMethod === method
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {method === "form"
                  ? "Form"
                  : method === "json"
                    ? "JSON"
                    : "Upload"}
              </button>
            ))}
          </div>
        </div>

        {inputMethod === "form" && (
          <>
            <input
              className="w-full border px-4 py-2 rounded-lg mb-3"
              placeholder="Election title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <textarea
              className="w-full border px-4 py-2 rounded-lg mb-3"
              placeholder="Description (optional)"
              rows="3"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
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
              className="w-full border px-4 py-2 rounded-lg mb-3"
              placeholder="Thumbnail URL (optional)"
              value={form.thumbnail}
              onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
            />

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
          </>
        )}

        {inputMethod === "json" && (
          <div className="mb-4">
            <textarea
              className="w-full border px-4 py-2 rounded-lg mb-2"
              placeholder='Enter JSON data, e.g.: {"title": "Election Title", "category": "PANCHAYAT", "startDate": "2024-01-01", "endDate": "2024-01-31"}'
              rows="8"
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Enter valid JSON with election data
            </p>
          </div>
        )}

        {inputMethod === "upload" && (
          <div className="mb-4">
            <input
              type="file"
              accept=".json"
              onChange={(e) => setUploadFile(e.target.files[0])}
              className="w-full border px-4 py-2 rounded-lg mb-2"
            />
            <p className="text-xs text-gray-500">
              Upload a JSON file containing election data
            </p>
            {uploadFile && (
              <p className="text-sm text-green-600">
                File selected: {uploadFile.name}
              </p>
            )}
          </div>
        )}

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
