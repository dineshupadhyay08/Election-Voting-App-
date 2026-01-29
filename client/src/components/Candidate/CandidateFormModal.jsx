import { useState, useEffect } from "react";
import api from "../../store/axios.js";

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
    goodWorks: [],
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
          ? candidate.goodWorks
          : [],
        experience: candidate.experience || "",
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
        goodWorks: [],
        experience: "",
      });
    }
  }, [candidate]);

  const handleImageUpload = async () => {
    if (!imageFile) return "";
    const formData = new FormData();
    formData.append("file", imageFile);
    const response = await api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.url;
  };

  const handleSubmit = async () => {
    // Validation for required fields
    if (
      !form.fullName ||
      !form.gender ||
      !form.age ||
      !form.mobileNumber ||
      !form.party ||
      !form.address.village ||
      !form.election
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const imageUrl = await handleImageUpload();
      const dataToSend = {
        ...form,
        image: imageUrl,
        // Ensure address object is complete
        address: {
          village: form.address.village || "",
          district: form.address.district || "",
          state: form.address.state || "",
        },
        // Ensure goodWorks is an array
        goodWorks: Array.isArray(form.goodWorks) ? form.goodWorks : [],
      };

      console.log("Add Candidate payload:", dataToSend);

      let response;
      if (candidate) {
        response = await api.patch(`/candidates/${candidate._id}`, dataToSend);
      } else {
        response = await api.post("/candidates", dataToSend);
      }
      onSuccess(response.data);
      onClose();
    } catch (error) {
      console.error(
        `Error ${candidate ? "updating" : "adding"} candidate:`,
        error,
      );
      alert(`Error ${candidate ? "updating" : "adding"} candidate`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">
          {candidate ? "Update Candidate" : "Add Candidate"}
        </h3>

        <div className="space-y-3">
          <input
            className="w-full border px-4 py-2 rounded-lg"
            placeholder="Full Name *"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />

          <select
            className="w-full border px-4 py-2 rounded-lg"
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
            className="w-full border px-4 py-2 rounded-lg"
            placeholder="Age *"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
          />

          <input
            className="w-full border px-4 py-2 rounded-lg"
            placeholder="Mobile Number *"
            value={form.mobileNumber}
            onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
          />

          <input
            className="w-full border px-4 py-2 rounded-lg"
            placeholder="Party *"
            value={form.party}
            onChange={(e) => setForm({ ...form, party: e.target.value })}
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="w-full border px-4 py-2 rounded-lg"
          />

          <input
            className="w-full border px-4 py-2 rounded-lg"
            placeholder="Motto"
            value={form.motto}
            onChange={(e) => setForm({ ...form, motto: e.target.value })}
          />

          <select
            className="w-full border px-4 py-2 rounded-lg"
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
            className="w-full border px-4 py-2 rounded-lg"
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
            className="w-full border px-4 py-2 rounded-lg"
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
            className="w-full border px-4 py-2 rounded-lg"
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
            className="w-full border px-4 py-2 rounded-lg"
            placeholder="Good Works (comma separated)"
            rows="2"
            value={form.goodWorks.join(", ")}
            onChange={(e) =>
              setForm({
                ...form,
                goodWorks: e.target.value
                  .split(",")
                  .map((item) => item.trim())
                  .filter((item) => item),
              })
            }
          />

          <textarea
            className="w-full border px-4 py-2 rounded-lg"
            placeholder="Experience"
            rows="2"
            value={form.experience}
            onChange={(e) => setForm({ ...form, experience: e.target.value })}
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="border px-4 py-2 rounded-lg">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
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
