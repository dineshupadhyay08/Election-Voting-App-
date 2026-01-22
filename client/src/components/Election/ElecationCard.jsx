import { useNavigate } from "react-router-dom";

const ElectionCard = ({ election, isAdmin, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const totalVotes = election.voters?.length || 0;
  const totalCandidates = election.candidates?.length || 0;
  const voterTurnout =
    totalCandidates > 0 ? Math.round((totalVotes / totalCandidates) * 100) : 0;

  return (
    <div
      className="bg-white rounded-2xl p-5 shadow space-y-4 cursor-pointer hover:shadow-lg transition"
      onClick={() => navigate(`/elections/${election._id}`)}
    >
      {/* THUMBNAIL IMAGE */}
      {election.thumbnail && (
        <img
          src={election.thumbnail}
          alt={election.title}
          className="w-full h-32 object-cover rounded-lg mb-4"
        />
      )}

      {/* TITLE + STATUS */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold flex items-center gap-2">
          {election.status === "LIVE" && (
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          )}
          <span className={election.status === "LIVE" ? "text-green-600" : ""}>
            {election.title}
          </span>
        </h3>

        <span
          className={`text-xs px-2 py-1 rounded ${
            election.status === "LIVE"
              ? "bg-green-100 text-green-600"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {election.status}
        </span>
      </div>

      {/* CATEGORY */}
      <p className="text-sm text-gray-500">{election.category}</p>

      {/* VOTER TURNOUT */}
      <div className="flex justify-between items-center">
        <p className="text-sm">
          Voter Turnout: <b>{voterTurnout}%</b>
        </p>
        <p className="text-sm text-gray-500">
          {totalVotes}/{totalCandidates} votes
        </p>
      </div>

      {/* TOP 3 CANDIDATES */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Top Candidates</h4>
        {election.candidates?.length > 0 ? (
          election.candidates.slice(0, 3).map((c) => (
            <div key={c._id} className="flex items-center gap-3">
              <img
                src={c.image || "/logo.png"}
                alt={c.fullName}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{c.fullName}</p>
                <p className="text-xs text-gray-500">({c.party})</p>
              </div>
              <p className="text-sm font-semibold">{c.voteCount || 0} votes</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No candidates added yet</p>
        )}
      </div>

      <div className="flex justify-between items-center">
        <p
          className="text-indigo-600 text-sm cursor-pointer hover:underline"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/candidates?electionId=${election._id}`);
          }}
        >
          See all candidates →
        </p>

        {/* ACTIONS */}
        {isAdmin && (
          <div className="flex gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="text-indigo-600 text-sm"
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-red-600 text-sm"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ElectionCard;
