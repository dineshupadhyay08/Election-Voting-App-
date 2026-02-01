import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Award } from "lucide-react";
import api from "../store/axios";

import { toast } from "react-toastify";

const ElectionCandidateCard = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);

  useEffect(() => {
    api.get("/candidates").then((res) => setCandidates(res.data));
    api
      .get("/voters/me")
      .then((res) => setUser(res.data))
      .catch(() => {});
  }, []);

  const handleVote = (id) => {
    toast.success(`Vote submitted for ${id}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {candidates.map((c) => (
        <div
          key={c._id}
          className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition"
        >
          <div className="flex flex-row sm:flex-col gap-4">
            {/* IMAGE */}
            <img
              src={c.image}
              alt={c.fullName}
              className="w-24 h-24 sm:w-full sm:h-48 object-cover rounded-xl"
            />

            {/* INFO */}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">{c.fullName}</h3>

              <div className="flex items-center gap-2 text-sm text-gray-700 mt-1">
                <Award className="w-4 h-4 text-indigo-600" />
                {c.party}
              </div>

              <p className="text-sm text-gray-500 mt-1">Age {c.age || 40}</p>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => navigate(`/candidates/${c._id}`)}
              className="flex-1 border-2 border-indigo-600 text-indigo-600 py-2 rounded-lg font-medium hover:bg-indigo-50"
            >
              View Profile
            </button>

            <button
              onClick={() => handleVote(c._id)}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700"
            >
              Vote
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ElectionCandidateCard;
