import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../store/axios";

const CandidateDetails = () => {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);

  useEffect(() => {
    api.get(`/candidates/${id}`).then((res) => setCandidate(res.data));
  }, [id]);

  if (!candidate) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4 sm:px-0">
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow">
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <img
            src={candidate.image}
            alt={candidate.fullName}
            className="w-32 h-32 sm:w-40 sm:h-40 rounded-xl object-cover"
          />

          <div className="text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-semibold">
              {candidate.fullName}
            </h1>
            <p className="text-gray-500">{candidate.party}</p>
            <p className="text-sm text-gray-400 mt-1">
              Votes: {candidate.voteCount}
            </p>
          </div>
        </div>
      </div>

      {/* INFO */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow space-y-3 text-sm">
        <h3 className="font-semibold text-base">Personal Information</h3>
        <p>
          <b>Gender:</b> {candidate.gender}
        </p>
        <p>
          <b>Father:</b> {candidate.fatherName}
        </p>
        <p>
          <b>Mother:</b> {candidate.motherName}
        </p>
        <p>
          <b>Mobile:</b> {candidate.mobileNumber}
        </p>
        <p>
          <b>Email:</b> {candidate.email || "N/A"}
        </p>
      </div>
    </div>
  );
};

export default CandidateDetails;
