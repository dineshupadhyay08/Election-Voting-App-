import { useEffect, useState } from "react";
import api from "../store/axios";

const Party = () => {
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dummy data
  const dummyParties = [
    {
      party: "BJP",
      symbol: "/logo.png",
      candidateCount: 5,
      candidates: [
        {
          fullName: "John Doe",
          image: "/logo.png",
          motto: "Vision for better future",
        },
        {
          fullName: "Jane Smith",
          image: "/logo.png",
          motto: "Empowering the people",
        },
      ],
    },
    {
      party: "INC",
      symbol: "/logo.png",
      candidateCount: 4,
      candidates: [
        {
          fullName: "Alice Johnson",
          image: "/logo.png",
          motto: "Unity and progress",
        },
      ],
    },
    // Add more dummy parties as needed
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

  if (loading) {
    return <div className="text-center py-8">Loading parties...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl px-4 sm:px-6 py-5 shadow-sm">
        <h1 className="text-xl sm:text-2xl font-semibold">Parties</h1>
        <p className="text-sm text-gray-500 mt-1">
          Explore all political parties and their candidates.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {parties.map((party) => (
          <div key={party.party} className="bg-white rounded-2xl p-6 shadow">
            <div className="flex items-center mb-4">
              <img
                src={party.symbol || "/logo.png"}
                alt={party.party}
                className="w-12 h-12 mr-4"
              />
              <div>
                <h3 className="font-semibold">{party.party}</h3>
                <p className="text-sm text-gray-500">
                  {party.candidateCount} candidates
                </p>
              </div>
            </div>

            {party.candidates && party.candidates.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Candidates:</h4>
                <div className="space-y-2">
                  {party.candidates.slice(0, 3).map((candidate, idx) => (
                    <div key={idx} className="flex items-center">
                      <img
                        src={candidate.image || "/logo.png"}
                        alt={candidate.fullName}
                        className="w-8 h-8 rounded-full mr-3"
                      />
                      <div>
                        <p className="text-sm font-medium">
                          {candidate.fullName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {candidate.motto}
                        </p>
                      </div>
                    </div>
                  ))}
                  {party.candidates.length > 3 && (
                    <p className="text-sm text-indigo-600">
                      +{party.candidates.length - 3} more
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Party;
