import { useNavigate } from "react-router-dom";

const ElectionCard = ({ election }) => {
  const navigate = useNavigate();

  const totalVotes = election.voters?.length || 0;
  const totalVoters = election.totalVoters || 896;
  const turnoutPercent =
    totalVoters > 0 ? Math.round((totalVotes / totalVoters) * 100) : 0;

  return (
    <div
      onClick={() => navigate(`/elections/${election._id}`)}
      className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition cursor-pointer space-y-4 border"
    >
      {/* HEADER */}
      <div className="flex items-start gap-3">
        {/* ICON / THUMBNAIL */}
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
          <img
            src={election.thumbnail || "/Register_vote_img.jpg"}
            alt={election.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* TITLE */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{election.title}</h3>

            {election.status === "LIVE" && (
              <span className="flex items-center gap-1 text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                LIVE
              </span>
            )}
          </div>

          <p className="text-sm text-gray-500">{election.category}</p>
        </div>
      </div>

      {/* VOTES */}
      <div className="flex items-center gap-3">
        <p className="text-sm font-medium text-gray-700">
          {totalVotes}/{totalVoters} votes cast
        </p>

        {election.status === "LIVE" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/elections/${election._id}`);
            }}
            className="ml-auto bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-1.5 rounded-lg"
          >
            Vote Now
          </button>
        )}
      </div>

      {/* PROGRESS BAR */}
      <div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-600"
            style={{ width: `${turnoutPercent}%` }}
          ></div>
        </div>

        <p className="text-xs text-gray-500 mt-1">
          {turnoutPercent}% voter turnout
        </p>
      </div>

      {/* CANDIDATES PREVIEW */}
      {Array.isArray(election.candidates) &&
        election.candidates.slice(0, 2).map((c) => (
          <div key={c._id} className="flex items-center gap-3 text-sm">
            <img
              src={c.image || "/user.png"}
              alt={c.fullName}
              className="w-8 h-8 rounded-full object-cover"
            />

            <p className="font-medium text-gray-800">
              {c.fullName} <span className="text-gray-500">({c.party})</span>
            </p>
          </div>
        ))}

      {/* SEE ALL */}
      <p
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/elections/${election._id}`);
        }}
        className="text-sm text-indigo-600 hover:underline mt-2"
      >
        View election →
      </p>
    </div>
  );
};

export default ElectionCard;
