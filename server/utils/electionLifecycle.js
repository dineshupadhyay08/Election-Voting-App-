const getElectionStatus = (election) => {
  const now = new Date();
  const startDate = new Date(election.startDate);
  const endDate = new Date(election.endDate);

  if (now < startDate) return "UPCOMING";
  if (now > endDate) return "COMPLETED";
  return "LIVE";
};

const isVotingAllowed = (election) => {
  const now = new Date();
  const startDate = new Date(election.startDate);
  // Set end date to end of day for inclusive comparison
  const endDate = new Date(election.endDate);
  endDate.setHours(23, 59, 59, 999);

  return election.isActive && now >= startDate && now <= endDate;
};

module.exports = { getElectionStatus, isVotingAllowed };
