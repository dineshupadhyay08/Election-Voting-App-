import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../store/axios";

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/candidates").then((res) => setCandidates(res.data));
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl px-4 sm:px-6 py-5 shadow-sm">
        <h1 className="text-xl sm:text-2xl font-semibold">Candidates</h1>
        <p className="text-sm text-gray-500 mt-1">
          Select your candidate and make your vote count.
        </p>
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

            <div className="mt-4 flex justify-between">
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default Candidates;
