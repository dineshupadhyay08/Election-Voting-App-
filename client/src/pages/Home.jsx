import LatestUpdates from "../components/LatestUpdates";
import AssemblyElectionCard from "../components/AssemblyElection";

const Home = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
      {/* MAIN CONTENT */}
      <div className="space-y-6">
        <AssemblyElectionCard />

        {/* Parties & Candidates */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow">
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold">Parties & Candidates</h3>
            <span className="text-indigo-600 text-sm">See all</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-xl p-3 flex justify-center"
              >
                <img
                  src="/logo.png"
                  alt="party"
                  className="w-8 h-8 sm:w-10 sm:h-10"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Things to know */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            "Manifesto highlights",
            "FAQs & Voter education",
            "Find polling station",
          ].map((t) => (
            <div key={t} className="bg-white rounded-2xl p-5 sm:p-6 shadow">
              <img src="/logo.png" className="w-8 h-8 sm:w-10 sm:h-10 mb-3" />
              <p className="font-medium">{t}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="order-last lg:order-none">
        <LatestUpdates />
      </div>
    </div>
  );
};

export default Home;
