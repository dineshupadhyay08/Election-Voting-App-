import LatestUpdates from "../components/LatestUpdates";
import AssemblyElectionCard from "../components/AssemblyElection";

const Home = () => {
  return (
    <div className="grid grid-cols-[1fr_320px] gap-6">
      {/* MAIN CONTENT */}
      <div className="space-y-6">
        {/* 🔥 Assembly Election (component) */}
        <AssemblyElectionCard />

        {/* Parties & Candidates */}
        <div className="bg-white rounded-2xl p-6 shadow">
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold">Parties & Candidates</h3>
            <span className="text-indigo-600 text-sm">See all</span>
          </div>

          <div className="grid grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-xl p-4 flex justify-center"
              >
                <img src="/logo.png" alt="party" className="w-10 h-10" />
              </div>
            ))}
          </div>
        </div>

        {/* Things to know */}
        <div className="grid grid-cols-3 gap-4">
          {[
            "Manifesto highlights",
            "FAQs & Voter education",
            "Find polling station",
          ].map((t) => (
            <div key={t} className="bg-white rounded-2xl p-6 shadow">
              <img src="/logo.png" className="w-10 h-10 mb-3" />
              <p className="font-medium">{t}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <LatestUpdates />
    </div>
  );
};

export default Home;
