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

  useEffect(() => {
    api.get("/elections").then((res) => {
      const data = res.data[0];
      setElection(data);

      if (data) {
        setForm({
          title: data.title || "",
          electionDate: data.electionDate ? data.electionDate.slice(0, 10) : "",
        });
      }
    });
  }, []);

  useEffect(() => {
    api
      .get("/voters/me")
      .then((res) => setIsAdmin(res.data.isAdmin === true))
      .catch(() => setIsAdmin(false));
  }, []);

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

  if (!election) return null;

  return (
    <>
      {/* ================= ELECTION COUNTDOWN SECTION ================= */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Election Countdown
        </h2>

        {/* GRADIENT CARD (UNCHANGED) */}
        <div className="bg-gradient-to-r from-purple-500 via-pink-400 to-orange-300 rounded-2xl p-4 sm:p-6 text-white shadow-lg">
          <h2 className="text-base sm:text-lg font-semibold">
            {election.title || "Assembly Election 2024"}
          </h2>

          <p className="text-sm opacity-90 mt-1 mb-4">
            Vote now to make your voice heard in the Assembly Election.
          </p>

          {/* COUNTDOWN */}
          <div className="flex gap-3 mb-5 flex-nowrap">
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
                <p className="text-lg font-semibold leading-none">
                  {item.value}
                </p>
                <p className="text-xs opacity-80">{item.label}</p>
              </div>
            ))}
          </div>

          {/* BUTTON (UNCHANGED) */}
          {!isAdmin && (
            <button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-lg font-medium">
              Vote Now
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => setShowModal(true)}
              className="w-full sm:w-auto bg-white text-indigo-600 px-6 py-2 rounded-lg font-medium"
            >
              Manage Election
            </button>
          )}
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold mb-4">
              Edit Assembly Election
            </h3>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, [e.target.name]: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-2 mb-3"
              placeholder="Election title"
            />

            <input
              type="date"
              name="electionDate"
              value={form.electionDate}
              onChange={(e) =>
                setForm({ ...form, [e.target.name]: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-2 mb-4"
            />

            <div className="flex justify-between items-center">
              <button
                onClick={() => {
                  if (!window.confirm("Delete this election?")) return;
                  api.delete(`/elections/${election._id}`).then(() => {
                    setElection(null);
                    setShowModal(false);
                  });
                }}
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
                  onClick={() => {
                    api
                      .patch(`/elections/${election._id}`, form)
                      .then((res) => {
                        setElection(res.data);
                        setShowModal(false);
                      });
                  }}
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
