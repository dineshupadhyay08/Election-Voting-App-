import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../store/axios";

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/candidates")
      .then((res) => setCandidates(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="space-y-6">
      {/* ================= HEADER (IMAGE JESA) ================= */}
      <div className="bg-white rounded-2xl px-6 py-5 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Candidates</h1>
            <p className="text-sm text-gray-500 mt-1">
              Select your candidate and make your vote count.
            </p>
          </div>

          {/* Right side (disabled like image) */}
          <div className="text-right text-gray-400 text-sm cursor-not-allowed">
            <div className="border px-4 py-2 rounded-lg">Filters ▾</div>
            <div className="mt-1 text-xs">Sort by: Name</div>
          </div>
        </div>
      </div>

      {/* ================= CANDIDATES GRID ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {candidates.map((c) => (
          <div
            key={c._id}
            className="bg-white rounded-2xl p-4 shadow hover:shadow-md transition"
          >
            {/* IMAGE + VOTE BADGE */}
            <div className="relative">
              <img
                src={c.image}
                alt={c.fullName}
                className="w-full h-44 object-cover rounded-xl"
              />

              {/* Vote count badge */}
              <span className="absolute bottom-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                {c.voteCount}
              </span>
            </div>

            {/* NAME */}
            <h3 className="mt-3 font-semibold text-lg">{c.fullName}</h3>

            {/* PARTY */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              {c.symbol && (
                <img
                  src={c.symbol}
                  alt="party"
                  className="w-5 h-5 object-contain"
                />
              )}
              <span>{c.party}</span>
            </div>

            {/* ROLE */}
            <p className="text-xs text-gray-400 mt-1">
              Role: Gram Pradhan Candidate
            </p>

            {/* KEY PRIORITIES */}
            <div className="mt-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Key Priorities:</p>
                <span className="text-indigo-600">•••</span>
              </div>

              <ul className="text-sm text-gray-500 list-disc ml-4 mt-1 space-y-1">
                {(c.goodWorks || []).slice(0, 2).map((work, i) => (
                  <li key={i}>{work}</li>
                ))}
              </ul>
            </div>

            {/* ACTION BUTTONS */}
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => navigate(`/candidates/${c._id}`)}
                className="text-indigo-600 text-sm font-medium border px-4 py-1.5 rounded-lg"
              >
                View Profile
              </button>

              <button className="bg-green-600 text-white text-sm px-4 py-1.5 rounded-lg">
                Vote
              </button>
            </div>
          </div>
        ))}

        {candidates.length === 0 && (
          <p className="text-gray-500">No candidates found</p>
        )}
      </div>
    </div>
  );
};

export default Candidates;
