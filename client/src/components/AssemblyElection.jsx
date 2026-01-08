import { useEffect, useState } from "react";
import api from "../store/axios.js";

const AssemblyElectionCard = () => {
  const [election, setElection] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [form, setForm] = useState({
    title: "",
    electionDate: "",
  });

  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  /* ===============================
     FETCH ELECTION
  =============================== */
  useEffect(() => {
    const fetchElection = async () => {
      try {
        const res = await api.get("/elections");
        const data = res.data[0];
        setElection(data);

        if (data) {
          setForm({
            title: data.title || "",
            electionDate: data.electionDate
              ? data.electionDate.slice(0, 10)
              : "",
          });
        }
      } catch (err) {
        console.error("Election fetch failed", err);
      }
    };

    fetchElection();
  }, []);

  /* ===============================
     FETCH USER → ADMIN CHECK
  =============================== */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/voters/me");
        setIsAdmin(res.data.isAdmin === true);
      } catch {
        setIsAdmin(false);
      }
    };

    fetchUser();
  }, []);

  /* ===============================
     COUNTDOWN LOGIC
  =============================== */
  const calculateCountdown = (date) => {
    const now = new Date().getTime();
    const target = new Date(date).getTime();
    const diff = target - now;

    if (diff <= 0) {
      return { days: "00", hours: "00", minutes: "00", seconds: "00" };
    }

    return {
      days: String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, "0"),
      hours: String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(
        2,
        "0"
      ),
      minutes: String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, "0"),
      seconds: String(Math.floor((diff / 1000) % 60)).padStart(2, "0"),
    };
  };

  useEffect(() => {
    if (!election?.electionDate) return;

    const interval = setInterval(() => {
      setTimeLeft(calculateCountdown(election.electionDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [election]);

  /* ===============================
     FORM HANDLERS
  =============================== */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const res = await api.patch(`/elections/${election._id}`, form);
      setElection(res.data);
      setShowModal(false);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this election?")) return;

    try {
      await api.delete(`/elections/${election._id}`);
      setElection(null);
      setShowModal(false);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  if (!election) return null;

  /* ===============================
     UI
  =============================== */
  return (
    <>
      {/* ================= CARD ================= */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-400 to-orange-300 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-lg font-semibold">
          {election.title || "Assembly Election 2024"}
        </h2>

        <p className="text-sm opacity-90 mt-1 mb-5">
          Vote now to make your voice heard in the Assembly Election.
        </p>

        {/* COUNTDOWN */}
        <div className="flex gap-3 mb-5">
          {[
            { label: "Days", value: timeLeft.days },
            { label: "Hours", value: timeLeft.hours },
            { label: "Minutes", value: timeLeft.minutes },
            { label: "Seconds", value: timeLeft.seconds },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white/20 backdrop-blur-md rounded-xl px-4 py-2 text-center min-w-[64px]"
            >
              <p className="text-lg font-semibold leading-none">{item.value}</p>
              <p className="text-xs opacity-80">{item.label}</p>
            </div>
          ))}
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4">
          {!isAdmin && (
            <button className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-lg font-medium">
              Vote Now
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-medium"
            >
              Manage Election
            </button>
          )}
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold mb-4">
              Edit Assembly Election
            </h3>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 mb-3"
              placeholder="Election title"
            />

            <input
              type="date"
              name="electionDate"
              value={form.electionDate}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 mb-4"
            />

            <div className="flex justify-between items-center">
              <button
                onClick={handleDelete}
                className="text-red-600 font-medium"
              >
                Delete Election
              </button>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AssemblyElectionCard;
