import { useEffect, useState } from "react";
import axios from "axios";

const AssemblyElectionCard = () => {
  const [election, setElection] = useState(null);
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  // 🔹 Election fetch
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/elections`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        // abhi maan lete hain ek hi election hai
        setElection(res.data[0]);
      })
      .catch((err) => console.log(err));
  }, []);

  // 🔹 Admin sets election date
  const handleSetDate = async () => {
    const date = prompt("Enter Election Date (YYYY-MM-DD)");
    if (!date) return;

    const res = await axios.patch(
      `${import.meta.env.VITE_API_URL}/elections/${election._id}`,
      { electionDate: date },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    setElection(res.data);
  };

  if (!election) return null;

  return (
    <div className="bg-gradient-to-r from-purple-500 to-orange-300 rounded-2xl p-6 text-white">
      <h2 className="text-lg font-semibold">
        {election.title || "Assembly Election 2024"}
      </h2>

      <p className="text-sm opacity-90 mt-1">
        Election Date:{" "}
        {election.electionDate
          ? new Date(election.electionDate).toDateString()
          : "Not set yet"}
      </p>

      <div className="flex gap-4 mt-4">
        {/* Vote button (all users) */}
        <button className="bg-indigo-600 px-6 py-2 rounded-lg">Vote Now</button>

        {/* Admin only */}
        {isAdmin && (
          <button
            onClick={handleSetDate}
            className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-medium"
          >
            Set Election Date
          </button>
        )}
      </div>
    </div>
  );
};

export default AssemblyElectionCard;
