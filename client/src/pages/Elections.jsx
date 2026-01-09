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

  useEffect(() => {
    api
      .get("/voters/me")
      .then((res) => setIsAdmin(res.data.isAdmin))
      .catch(() => {});
  }, []);

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
      {/* HEADER */}
      <div className="bg-white rounded-2xl px-4 sm:px-6 py-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
          <h1 className="text-xl font-semibold">Elections</h1>

          <button className="border rounded-lg px-4 py-2 text-sm text-gray-600">
            Filters ▾
          </button>
        </div>

        <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
          <div className="flex flex-wrap gap-3">
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

            <select className="border rounded-lg px-4 py-2 text-sm">
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

          <div className="flex gap-6 text-sm font-medium">
            {["ALL", "LIVE", "UPCOMING"].map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={status === s ? "text-indigo-600" : "text-gray-500"}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-8">
          <div>
            <h2 className="font-semibold text-lg mb-4">
              Ongoing Elections ({ongoing.length})
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {ongoing.map((e) => (
                <ElectionCard
                  key={e._id}
                  election={e}
                  isAdmin={isAdmin}
                  onEdit={() => {
                    setEditElection(e);
                    setShowModal(true);
                  }}
                />
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-4">Upcoming Elections</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {upcoming.map((e) => (
                <UpcomingElectionCard key={e._id} election={e} />
              ))}
            </div>
          </div>
        </div>

        <div className="order-last lg:order-none">
          <ElectionInsights />
        </div>
      </div>

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
