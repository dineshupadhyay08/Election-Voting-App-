import { useEffect, useState } from "react";
import api from "../store/axios.js";
import ElectionCard from "../components/Election/ElecationCard.jsx";
import UpcomingElectionCard from "../components/Election/UpcomingElection.jsx";
import ElectionInsights from "../components/Election/ELectionInsights.jsx";
import ElectionFormModal from "../components/Election/ElectionFormModal.jsx";

const Elections = () => {
  const [elections, setElections] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editElection, setEditElection] = useState(null);

  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("ALL");
  const [sort, setSort] = useState("");

  // 🔐 check admin
  useEffect(() => {
    api
      .get("/voters/me")
      .then((res) => setIsAdmin(res.data.isAdmin))
      .catch(() => setIsAdmin(false));
  }, []);

  // 🔹 fetch elections
  const fetchElections = async () => {
    const params = {};

    if (category) params.category = category;
    if (status !== "ALL") params.status = status;
    if (sort) params.sort = sort;

    const res = await api.get("/elections", { params });
    setElections(res.data);
  };

  useEffect(() => {
    fetchElections();
  }, []);

  useEffect(() => {
    fetchElections();
  }, [category, status, sort]);

  const ongoing = elections.filter((e) => e.status === "LIVE");
  const upcoming = elections.filter((e) => e.status === "UPCOMING");

  return (
    <div className="space-y-6">
      {/* ================= HEADER / FILTER ================= */}
      <div className="bg-white rounded-2xl px-6 py-4 shadow-sm ">
        {/* TOP ROW */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold text-gray-800">Elections</h1>

          <button className="flex items-center gap-2 border rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
            Filters
            <span className="text-xs">▾</span>
          </button>
        </div>

        {/* BOTTOM ROW */}
        <div className="flex justify-between items-center">
          {/* LEFT FILTERS */}
          <div className="flex gap-3 items-center">
            <select
              className="border rounded-lg px-4 py-2 text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Panchayat/Ward</option>
              <option value="PANCHAYAT">Panchayat</option>
              <option value="WARD">Ward</option>
              <option value="ASSEMBLY">Assembly</option>
              <option value="LOK_SABHA">Lok Sabha</option>
            </select>

            <select className="border rounded-lg px-4 py-2 text-sm text-gray-700 bg-white focus:outline-none">
              <option>Any Date</option>
            </select>

            <select
              className="border rounded-lg px-4 py-2 text-sm"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="">Sort by</option>
              <option value="ENDING_SOON">Ending soon</option>
            </select>
          </div>

          {/* RIGHT TABS */}
          <div className="flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => setStatus("ALL")}
              className={status === "ALL" ? "text-indigo-600" : "text-gray-500"}
            >
              All
            </button>

            <button
              onClick={() => setStatus("LIVE")}
              className={
                status === "LIVE" ? "text-indigo-600" : "text-gray-500"
              }
            >
              Live
              <span className="ml-1 bg-indigo-100 text-indigo-600 text-xs px-2 rounded-full">
                {elections.filter((e) => e.status === "LIVE").length}
              </span>
            </button>

            <button
              onClick={() => setStatus("UPCOMING")}
              className={
                status === "UPCOMING" ? "text-indigo-600" : "text-gray-500"
              }
            >
              Upcoming
            </button>
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="grid grid-cols-[1fr_320px] gap-6">
        {/* LEFT SIDE */}
        <div className="space-y-8">
          {/* Ongoing */}
          <div>
            <h2 className="font-semibold text-lg mb-4">
              Ongoing Elections ({ongoing.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ongoing.map((election) => (
                <ElectionCard
                  key={election._id}
                  election={election}
                  isAdmin={isAdmin}
                  onEdit={() => {
                    setEditElection(election);
                    setShowModal(true);
                  }}
                />
              ))}
            </div>
          </div>

          {/* Upcoming */}
          <div>
            <h2 className="font-semibold text-lg mb-4">Upcoming Elections</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcoming.map((election) => (
                <UpcomingElectionCard key={election._id} election={election} />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <ElectionInsights />
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <ElectionFormModal
          election={editElection}
          onClose={() => setShowModal(false)}
          onSuccess={fetchElections}
        />
      )}
    </div>
  );
};

export default Elections;
