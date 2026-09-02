import { useState, useEffect } from "react";
import api from "../../store/axios.js";
import { toast } from "react-toastify";

const CandidateFormModal = ({ candidate, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    fullName: "",
    gender: "",
    age: "",
    mobileNumber: "",
    party: "",
    image: "",
    motto: "",
    election: "",
    address: {
      village: "",
      district: "",
      state: "",
    },
    goodWorks: "",
    experience: "",
  });

  const [elections, setElections] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/elections").then((res) => setElections(res.data));
  }, []);

  useEffect(() => {
    if (candidate) {
      setForm({
        fullName: candidate.fullName || "",
        gender: candidate.gender || "",
        age: candidate.age || "",
        mobileNumber: candidate.mobileNumber || "",
        party: candidate.party || "",
        image: candidate.image || "",
        motto: candidate.motto || "",
        election: candidate.election?._id || candidate.election || "",
        address: {
          village: candidate.address?.village || "",
          district: candidate.address?.district || "",
          state: candidate.address?.state || "",
        },
        goodWorks: Array.isArray(candidate.goodWorks)
          ? candidate.goodWorks.join(", ")
          : "",
        experience: candidate.experience || "",
        isGlobal: candidate.isGlobal !== undefined ? candidate.isGlobal : true,
      });
    } else {
      setForm({
        fullName: "",
        gender: "",
        age: "",
        mobileNumber: "",
        party: "",
        image: "",
        motto: "",
        election: "",
        address: {
          village: "",
          district: "",
          state: "",
        },
        goodWorks: "",
        experience: "",
      });
    }
  }, [candidate]);

  const handleImageUpload = async () => {
    if (!imageFile) return form.image || "";

    const formData = new FormData();
    formData.append("file", imageFile);

    const res = await api.post("/uploads/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data.url;
  };

  const handleSubmit = async () => {
    if (!form.fullName || !form.party || !form.image && !imageFile || !form.election) {
      toast.error("Name, party, candidate image and election are required");
      return;
    }

    setLoading(true);
    try {
      const image = await handleImageUpload();
      const payload = {
        ...form,
        image,
      };

      if (candidate) delete payload.election;

      const response = candidate
        ? await api.patch(`/candidates/${candidate._id}`, payload)
        : await api.post("/candidates", payload);
      if (candidate) {
        toast.success("Candidate updated");
      } else {
        toast.success("Candidate created");
      }
      onSuccess(response.data.candidate);
      onClose();
    } catch {
      toast.error("Failed to save election");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'var(--modal-overlay)' }}>
      <div className="card-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">
          {candidate ? "Update Candidate" : "Add Candidate"}
        </h3>

        <div className="space-y-3">
          <input
            className="input"
            placeholder="Full Name *"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />

          <select
            className="input"
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
          >
            <option value="">Select Gender *</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>

          <input
            type="number"
            className="input"
            placeholder="Age *"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
          />

          <input
            className="input"
            placeholder="Mobile Number *"
            value={form.mobileNumber}
            onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
          />

          <input
            className="input"
            placeholder="Party *"
            value={form.party}
            onChange={(e) => setForm({ ...form, party: e.target.value })}
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="input"
          />

          <input
            className="input"
            placeholder="Motto"
            value={form.motto}
            onChange={(e) => setForm({ ...form, motto: e.target.value })}
          />

          <select
            className="input"
            value={form.election}
            onChange={(e) => setForm({ ...form, election: e.target.value })}
          >
            <option value="">Select Election *</option>
            {elections.map((election) => (
              <option key={election._id} value={election._id}>
                {election.title}
              </option>
            ))}
          </select>

          {/* Address Fields */}
          <input
            className="input"
            placeholder="Village *"
            value={form.address.village}
            onChange={(e) =>
              setForm({
                ...form,
                address: { ...form.address, village: e.target.value },
              })
            }
          />

          <input
            className="input"
            placeholder="District"
            value={form.address.district}
            onChange={(e) =>
              setForm({
                ...form,
                address: { ...form.address, district: e.target.value },
              })
            }
          />

          <input
            className="input"
            placeholder="State"
            value={form.address.state}
            onChange={(e) =>
              setForm({
                ...form,
                address: { ...form.address, state: e.target.value },
              })
            }
          />

          <textarea
            className="input textarea"
            placeholder="Good Works (describe your achievements)"
            rows="2"
            value={form.goodWorks}
            onChange={(e) =>
              setForm({
                ...form,
                goodWorks: e.target.value,
              })
            }
          />

          <textarea
            className="input textarea"
            placeholder="Experience"
            rows="2"
            value={form.experience}
            onChange={(e) => setForm({ ...form, experience: e.target.value })}
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary"
          >
            {loading
              ? candidate
                ? "Updating..."
                : "Adding..."
              : candidate
                ? "Update Candidate"
                : "Add Candidate"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateFormModal;
