import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../store/axios";

const PartiesCandidates = () => {
  const [parties, setParties] = useState([]);
  const [selectedParty, setSelectedParty] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dummy data
  const dummyParties = [
    { party: "BJP", symbol: "/logo.png", candidateCount: 5 },
    { party: "INC", symbol: "/logo.png", candidateCount: 4 },
    { party: "AAP", symbol: "/logo.png", candidateCount: 3 },
    { party: "BSP", symbol: "/logo.png", candidateCount: 2 },
    { party: "CPI", symbol: "/logo.png", candidateCount: 1 },
    { party: "NCP", symbol: "/logo.png", candidateCount: 6 },
  ];

  useEffect(() => {
    const fetchParties = async () => {
      try {
        const res = await api.get("/parties");
        setParties(res.data.length > 0 ? res.data : dummyParties);
      } catch (error) {
        console.error("Error fetching parties:", error);
        setParties(dummyParties);
      } finally {
        setLoading(false);
      }
    };
    fetchParties();
  }, []);

  const handlePartyClick = (party) => {
    setSelectedParty(selectedParty?.party === party.party ? null : party);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow">
        <div className="flex justify-between mb-4">
          <h3 className="font-semibold">Parties & Candidates</h3>
          <Link to="/party" className="text-indigo-600 text-sm hover:underline">
            See all
          </Link>
        </div>
        <div className="text-center py-8">Loading parties...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow">
      <div className="flex justify-between mb-4">
        <h3 className="font-semibold">Parties & Candidates</h3>
        <Link to="/party" className="text-indigo-600 text-sm hover:underline">
          See all
        </Link>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
        {parties.map((party) => (
          <div
            key={party.party}
            className="bg-gray-100 rounded-xl p-3 flex flex-col justify-center items-center cursor-pointer hover:bg-gray-200 transition"
            onClick={() => handlePartyClick(party)}
          >
            <img
              src={party.symbol || "/logo.png"}
              alt={party.party}
              className="w-8 h-8 sm:w-10 sm:h-10 mb-2"
            />
            <p className="text-xs font-medium text-center">{party.party}</p>
            <p className="text-xs text-gray-500">
              {party.candidateCount} candidates
            </p>
          </div>
        ))}
      </div>

      {selectedParty && (
        <div className="mt-6 border-t pt-4">
          <h4 className="font-semibold mb-3">
            {selectedParty.party} Candidates
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedParty.candidates.map((candidate) => (
              <div key={candidate._id} className="bg-gray-50 rounded-lg p-3">
                <img
                  src={candidate.image}
                  alt={candidate.fullName}
                  className="w-full h-20 object-cover rounded mb-2"
                />
                <h5 className="font-medium text-sm">{candidate.fullName}</h5>
                <p className="text-xs text-gray-500">{candidate.motto}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PartiesCandidates;
