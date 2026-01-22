import LatestUpdates from "../components/LatestUpdates";
import AssemblyElectionCard from "../components/AssemblyElection";
import PartiesCandidates from "../components/PartiesCandidates";

const Home = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
      {/* MAIN CONTENT */}
      <div className="space-y-6">
        <AssemblyElectionCard />

        {/* Parties & Candidates */}
        <PartiesCandidates />

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
