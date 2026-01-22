import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../store/axios";
import CandidateFormModal from "../components/Candidate/CandidateFormModal";

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/candidates").then((res) => setCandidates(res.data));
    api
      .get("/voters/me")
      .then((res) => setUser(res.data))
      .catch(() => {});
  }, []);

  const handleAddSuccess = () => {
    api.get("/candidates").then((res) => setCandidates(res.data));
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this candidate?")) {
      try {
        await api.delete(`/candidates/${id}`);
        setCandidates(candidates.filter((c) => c._id !== id));
      } catch (error) {
        console.error("Error deleting candidate:", error);
        alert("Error deleting candidate");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl px-4 sm:px-6 py-5 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold">Candidates</h1>
            <p className="text-sm text-gray-500 mt-1">
              Select your candidate and make your vote count.
            </p>
          </div>
          {user?.isAdmin && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Add Candidate
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {candidates.map((c) => (
          <div key={c._id} className="bg-white rounded-2xl p-4 shadow">
            <img
              src={c.image}
              alt={c.fullName}
              className="w-full h-44 object-cover rounded-xl"
            />

            <h3 className="mt-3 font-semibold">{c.fullName}</h3>
            <p className="text-sm text-gray-500">{c.party}</p>

            <div className="mt-4 flex flex-col gap-2">
              <div className="flex justify-between">
                <button
                  onClick={() => navigate(`/candidates/${c._id}`)}
                  className="text-indigo-600 border px-4 py-1.5 rounded-lg text-sm"
                >
                  View Profile
                </button>

                <button className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm">
                  Vote
                </button>
              </div>
              {user?.isAdmin && (
                <div className="flex justify-between">
                  <button
                    onClick={() => {
                      setEditingCandidate(c);
                      setShowModal(true);
                    }}
                    className="bg-yellow-600 text-white px-4 py-1.5 rounded-lg text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <CandidateFormModal
          candidate={editingCandidate}
          onClose={() => {
            setShowModal(false);
            setEditingCandidate(null);
          }}
          onSuccess={handleAddSuccess}
        />
      )}
    </div>
  );
};

export default Candidates;
