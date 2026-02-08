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
        {/* <PartiesCandidates /> */}

        {/* Things to know */}
        <div>
          <h3 className="font-semibold mb-4">Things to know</h3>

          {/* MOBILE */}
          <div className="flex gap-4 sm:hidden">
            {[
              "Top Manifesto Highlights",
              "FAQs & Voter Education",
              "Find near by polling station",
            ].map((text, i) => (
              <div
                key={i}
                className="flex-1 rounded-2xl p-5 text-white text-sm text-center bg-gradient-to-br
        from-purple-400 via-pink-400 to-orange-300"
              >
                {text}
              </div>
            ))}
          </div>

          {/* DESKTOP (UNCHANGED) */}
          <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "Top Manifesto Highlights",
              "FAQs & Voter Education",
              "Find near by polling station",
            ].map((t, index) => (
              <div
                key={t}
                className="bg-gradient-to-r from-purple-200 to-pink-200 rounded-2xl p-6 shadow"
              >
                <p className="font-medium">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="order-last lg:order-none">{/* <LatestUpdates /> */}</div>
    </div>
  );
};

export default Home;
