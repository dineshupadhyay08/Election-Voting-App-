import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../store/axios";
import CandidateFormModal from "../components/Candidate/CandidateFormModal";
import { toast } from "react-toastify";

const CandidateDetails = () => {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    api.get(`/candidates/${id}`).then((res) => setCandidate(res.data));
    api
      .get("/voters/me")
      .then((res) => setUser(res.data))
      .catch(() => {});
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

          <div className="text-center sm:text-left flex-1">
            <h1 className="text-xl sm:text-2xl font-semibold">
              {candidate.fullName}
            </h1>
            <p className="text-gray-500">{candidate.party}</p>
            <p className="text-sm text-gray-400 mt-1">
              Votes: {candidate.voteCount}
            </p>
            {candidate.motto && (
              <p className="text-sm text-gray-600 mt-2 italic">
                "{candidate.motto}"
              </p>
            )}
          </div>

          {user?.isAdmin && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
            >
              Edit Candidate
            </button>
          )}
        </div>
      </div>

      {/* PERSONAL INFO */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow space-y-3 text-sm">
        <h3 className="font-semibold text-base">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p>
            <b>Full Name:</b> {candidate.fullName}
          </p>
          <p>
            <b>Gender:</b> {candidate.gender}
          </p>
          <p>
            <b>Age:</b> {candidate.age}
          </p>
          <p>
            <b>Father:</b> {candidate.fatherName || "N/A"}
          </p>
          <p>
            <b>Mother:</b> {candidate.motherName || "N/A"}
          </p>
          <p>
            <b>Spouse:</b> {candidate.spouseName || "N/A"}
          </p>
          <p>
            <b>Mobile:</b> {candidate.mobileNumber}
          </p>
          <p>
            <b>Email:</b> {candidate.email || "N/A"}
          </p>
        </div>
      </div>

      {/* ADDRESS */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow space-y-3 text-sm">
        <h3 className="font-semibold text-base">Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p>
            <b>Village:</b> {candidate.address?.village}
          </p>
          <p>
            <b>District:</b> {candidate.address?.district}
          </p>
          <p>
            <b>State:</b> {candidate.address?.state}
          </p>
        </div>
      </div>

      {/* POLITICAL INFO */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow space-y-3 text-sm">
        <h3 className="font-semibold text-base">Political Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p>
            <b>Party:</b> {candidate.party}
          </p>
          <p>
            <b>Symbol:</b> {candidate.symbol || "N/A"}
          </p>
          <p>
            <b>Election:</b> {candidate.election?.title || "N/A"}
          </p>
          <p>
            <b>Vote Count:</b> {candidate.voteCount}
          </p>
        </div>
        {candidate.motto && (
          <p>
            <b>Motto:</b> {candidate.motto}
          </p>
        )}
        {candidate.goodWorks && candidate.goodWorks.trim() && (
          <p>
            <b>Good Works:</b> {candidate.goodWorks}
          </p>
        )}
        {candidate.badWorks && candidate.badWorks.length > 0 && (
          <div>
            <b>Controversies:</b>
            <ul className="list-disc list-inside mt-1">
              {candidate.badWorks.map((work, index) => (
                <li key={index}>{work}</li>
              ))}
            </ul>
          </div>
        )}
        {candidate.experience && (
          <p>
            <b>Experience:</b> {candidate.experience}
          </p>
        )}
      </div>

      {showModal && (
        <CandidateFormModal
          candidate={candidate}
          onClose={() => setShowModal(false)}
          onSuccess={(updatedCandidate) => {
            setCandidate(updatedCandidate);
            setShowModal(false);
            toast.success("Candidate updated successfully!");
          }}
        />
      )}
    </div>
  );
};

export default CandidateDetails;
