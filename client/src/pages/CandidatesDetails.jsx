import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../store/axios";

const CandidateDetails = () => {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);

  useEffect(() => {
    api
      .get(`/candidates/${id}`)
      .then((res) => setCandidate(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!candidate) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow">
        <div className="flex gap-6">
          <img
            src={candidate.image}
            alt={candidate.fullName}
            className="w-40 h-40 object-cover rounded-xl"
          />

          <div>
            <h1 className="text-2xl font-semibold">{candidate.fullName}</h1>
            <p className="text-gray-500">{candidate.party}</p>
            <p className="text-sm text-gray-400 mt-1">
              Votes: {candidate.voteCount}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow space-y-4">
        <h3 className="font-semibold">Personal Information</h3>

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

        <p>
          <b>Address:</b> {candidate.address?.village},{" "}
          {candidate.address?.district}, {candidate.address?.state}
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow space-y-3">
        <h3 className="font-semibold">Vision & Work</h3>

        <p>
          <b>Motto:</b> {candidate.motto}
        </p>

        <div>
          <b>Good Works:</b>
          <ul className="list-disc ml-6">
            {candidate.goodWorks?.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>

        <div>
          <b>Bad Works:</b>
          <ul className="list-disc ml-6">
            {candidate.badWorks?.length > 0 ? (
              candidate.badWorks.map((w, i) => <li key={i}>{w}</li>)
            ) : (
              <li>None</li>
            )}
          </ul>
        </div>

        <p>
          <b>Experience:</b> {candidate.experience}
        </p>
      </div>
    </div>
  );
};

export default CandidateDetails;
