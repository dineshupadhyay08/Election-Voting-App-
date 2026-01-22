import { useState, useEffect } from "react";
import api from "../../store/axios.js";

const CandidateFormModal = ({ candidate, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    fullName: "",
    gender: "",
    mobileNumber: "",
    party: "",
    image: "",
    motto: "",
    electionId: "",
    fatherName: "",
    motherName: "",
    email: "",
    address: "",
    goodWorks: "",
    badWorks: "",
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
        mobileNumber: candidate.mobileNumber || "",
        party: candidate.party || "",
        image: candidate.image || "",
        motto: candidate.motto || "",
        electionId: candidate.election?._id || candidate.election || "",
        fatherName: candidate.fatherName || "",
        motherName: candidate.motherName || "",
        email: candidate.email || "",
        address: candidate.address || "",
        goodWorks: candidate.goodWorks || "",
        badWorks: candidate.badWorks || "",
        experience: candidate.experience || "",
      });
    } else {
      setForm({
        fullName: "",
        gender: "",
        mobileNumber: "",
        party: "",
        image: "",
        motto: "",
        electionId: "",
        fatherName: "",
        motherName: "",
        email: "",
        address: "",
        goodWorks: "",
        badWorks: "",
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
    setLoading(true);
    try {
      const imageUrl = await handleImageUpload();
      const dataToSend = { ...form, image: imageUrl };

      if (candidate) {
        await api.patch(`/candidates/${candidate._id}`, dataToSend);
      } else {
        await api.post("/candidates", dataToSend);
      }
      onSuccess();
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
        <h3 className="text-lg font-semibold mb-4">Add Candidate</h3>

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
            placeholder="Motto *"
            value={form.motto}
            onChange={(e) => setForm({ ...form, motto: e.target.value })}
          />

          <select
            className="w-full border px-4 py-2 rounded-lg"
            value={form.electionId}
            onChange={(e) => setForm({ ...form, electionId: e.target.value })}
          >
            <option value="">Select Election *</option>
            {elections.map((election) => (
              <option key={election._id} value={election._id}>
                {election.title}
              </option>
            ))}
          </select>

          <input
            className="w-full border px-4 py-2 rounded-lg"
            placeholder="Father Name"
            value={form.fatherName}
            onChange={(e) => setForm({ ...form, fatherName: e.target.value })}
          />

          <input
            className="w-full border px-4 py-2 rounded-lg"
            placeholder="Mother Name"
            value={form.motherName}
            onChange={(e) => setForm({ ...form, motherName: e.target.value })}
          />

          <input
            className="w-full border px-4 py-2 rounded-lg"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            className="w-full border px-4 py-2 rounded-lg"
            placeholder="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />

          <textarea
            className="w-full border px-4 py-2 rounded-lg"
            placeholder="Good Works"
            rows="2"
            value={form.goodWorks}
            onChange={(e) => setForm({ ...form, goodWorks: e.target.value })}
          />

          <textarea
            className="w-full border px-4 py-2 rounded-lg"
            placeholder="Bad Works"
            rows="2"
            value={form.badWorks}
            onChange={(e) => setForm({ ...form, badWorks: e.target.value })}
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
