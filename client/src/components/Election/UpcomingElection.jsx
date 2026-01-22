const UpcomingElectionCard = ({ election, isAdmin, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl p-5 shadow flex justify-between items-center">
      <div>
        <h3 className="font-semibold">{election.title}</h3>
        <p className="text-sm text-gray-500">
          Starts: {new Date(election.startDate).toDateString()}
        </p>
      </div>

      <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg">
        Notify Me
      </button>
    </div>
  );
};

export default UpcomingElectionCard;
