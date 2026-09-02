import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { History, AlertTriangle, Loader, CheckCircle2 } from "lucide-react";
import api from "../store/axios";

const PollHistory = () => {
  const [votingHistory, setVotingHistory] = useState([]);

  const { isLoading, error, data: userData } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const res = await api.get("/voters/me");
      return res.data;
    },
  });

  useEffect(() => {
    const fetchVotingHistory = async () => {
      try {
        // Fetch all elections to get details about voted elections
        const res = await api.get("/elections");
        const allElections = res.data || [];

        if (userData?.votedElections) {
          const history = allElections.filter((e) =>
            userData.votedElections.includes(e._id || e.id)
          );
          setVotingHistory(history);
        }
      } catch (err) {
        console.error("Failed to fetch voting history", err);
      }
    };

    if (userData?.votedElections) {
      fetchVotingHistory();
    }
  }, [userData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader size={40} className="animate-spin text-amber-500 mx-auto mb-4" />
          <p className="text-text-muted">Loading voting history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-8 text-center">
        <AlertTriangle size={40} className="mx-auto text-red-500 mb-4" />
        <p className="text-text-muted">Failed to load voting history</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Voting History</h1>
        <p className="mt-1 text-text-muted">
          Elections you have participated in
        </p>
      </div>

      {/* Summary */}
      <div className="card p-6">
        <div className="flex items-center gap-4">
          <div className="glass rounded-2xl p-4">
            <CheckCircle2 size={24} className="text-green-500" />
          </div>
          <div>
            <p className="text-sm text-text-muted">Total Elections Voted</p>
            <p className="text-3xl font-bold">
              {userData?.votedElections?.length || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Voting History List */}
      {votingHistory.length > 0 ? (
        <div className="space-y-3">
          {votingHistory.map((election) => (
            <div key={election._id || election.id} className="card p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg truncate">
                      {election.title}
                    </h3>
                    <span className="badge-success text-xs">✓ Voted</span>
                  </div>
                  <p className="text-sm text-text-muted line-clamp-2">
                    {election.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs">
                    <span className="text-text-muted">
                      Category: <span className="font-medium">{election.category}</span>
                    </span>
                    {election.status && (
                      <span className="text-text-muted">
                        Status:{" "}
                        <span className="font-medium">
                          {election.status === "LIVE"
                            ? "Active"
                            : election.status === "UPCOMING"
                            ? "Upcoming"
                            : "Ended"}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <History size={48} className="mx-auto text-text-muted mb-4 opacity-50" />
          <h3 className="text-lg font-semibold">No voting history yet</h3>
          <p className="mt-2 text-text-muted">
            Your voting participation will appear here
          </p>
        </div>
      )}
    </div>
  );
};

export default PollHistory;
