const ElectionCard = ({ election, isAdmin, onEdit }) => {
  const totalVotes = election.voters?.length || 0;

  return (
    <div className="bg-white rounded-2xl p-5 shadow space-y-4">
      {/* TITLE + STATUS */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">{election.title}</h3>

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

      {/* DATE INFO */}
      <p className="text-xs text-gray-400">
        {new Date(election.startDate).toDateString()} –{" "}
        {new Date(election.endDate).toDateString()}
      </p>

      {/* VOTES */}
      <p className="text-sm">
        Votes cast: <b>{totalVotes}</b>
      </p>

      {/* CANDIDATES (REAL BACKEND DATA) */}
      <ul className="text-sm text-gray-600 space-y-1">
        {election.candidates?.length > 0 ? (
          election.candidates.slice(0, 3).map((c) => (
            <li key={c._id}>
              • {c.name} ({c.party})
            </li>
          ))
        ) : (
          <li>No candidates added yet</li>
        )}
      </ul>

      <p className="text-indigo-600 text-sm cursor-pointer">
        See all candidates →
      </p>

      {/* ACTIONS */}
      <div className="flex justify-between items-center">
        {election.status === "LIVE" && (
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg">
            Vote Now
          </button>
        )}

        {isAdmin && (
          <button onClick={onEdit} className="text-indigo-600 text-sm">
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default ElectionCard;
