const ElectionInsights = ({ elections = [] }) => {
  const liveCount = elections.filter((e) => e.status === "LIVE").length;
  const upcomingCount = elections.filter((e) => e.status === "UPCOMING").length;
  const totalVotes = elections.reduce(
    (sum, e) => sum + (e.voters?.length || 0),
    0
  );

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl p-5 shadow">
        <h3 className="font-semibold mb-4">Election Insights</h3>

        <p className="text-sm">
          Live Elections: <b>{liveCount}</b>
        </p>
        <p className="text-sm">
          Upcoming Elections: <b>{upcomingCount}</b>
        </p>
        <p className="text-sm">
          Total Votes Cast: <b>{totalVotes}</b>
        </p>
      </div>
    </div>
  );
};

export default ElectionInsights;
