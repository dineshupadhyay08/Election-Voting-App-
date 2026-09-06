import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Clock3, ArrowRight, Vote, AlertTriangle, CheckCircle2, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../store/axios";
import { useAuth } from "../context/AuthContext";

const fetchDashboardOverview = async () => {
  const { data } = await api.get("/dashboard/overview");
  return data;
};

const formatDate = (value) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

const getGreeting = () => {
  const now = new Date();
  const hours = now.getHours();

  if (hours >= 5 && hours < 12) {
    return "Good Morning";
  } else if (hours >= 12 && hours < 17) {
    return "Good Afternoon";
  } else if (hours >= 17 && hours < 21) {
    return "Good Evening";
  } else {
    return "Good Night";
  }
};

const Home = () => {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState(getGreeting());
  const { data: overview, isLoading, isError, refetch } = useQuery({
    queryKey: ["dashboard-overview"],
    queryFn: fetchDashboardOverview,
  });

  useEffect(() => {
    setGreeting(getGreeting());

    // Update greeting every minute
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) return <div className="p-8 text-center card"><Loader className="animate-spin mx-auto text-[var(--brand-primary)]" /></div>;
  if (isError) return <div className="p-8 text-center card text-[var(--status-error)]">Error loading dashboard</div>;

  const liveElection = overview.liveElections[0];
  const upcomingElections = overview.upcomingElections || [];
  const activity = overview.activity || [];

  return (
    <div className="space-y-8 animate-fade-in p-6">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">{greeting}, {user?.fullName || "User"} 👋</h1>
        <p className="mt-1 text-[var(--text-muted)]">Your elections and voting activity in one place.</p>
      </header>

      {/* Live Election */}
      <section>
        <h2 className="text-lg font-semibold mb-4 text-[var(--text)]">Live Elections</h2>
        {liveElection ? (
          <div className="card p-6 border-l-4 border-[var(--brand-primary)]">
            <span className="badge-live">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-error)] animate-pulse" />
              LIVE
            </span>
            <h3 className="mt-3 text-xl font-bold text-[var(--text)]">{liveElection.title}</h3>
            <p className="mt-1 text-sm text-[var(--text-soft)]">{liveElection.description}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-[var(--text-muted)]">
              <span>{liveElection.candidateCount} Candidates</span>
              <span>Ends in {liveElection.remainingLabel}</span>
            </div>
            <Link to={`/elections/${liveElection.id}`} className="btn-primary mt-6 inline-flex">
              Vote Now <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="p-8 card border-dashed text-center text-[var(--text-muted)]">
            No live elections right now.
            <Link to="/elections" className="block mt-2 text-[var(--brand-primary)] font-medium">View Upcoming</Link>
          </div>
        )}
      </section>

      {/* Upcoming Section */}
      <section>
        <h2 className="text-lg font-semibold mb-4 text-[var(--text)]">Upcoming Elections</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {upcomingElections.map((election) => (
            <div key={election.id} className="card p-5 hover:border-[var(--brand-primary)] transition">
              <h4 className="font-semibold text-[var(--text)]">{election.title}</h4>
              <p className="mt-2 text-xs text-[var(--text-muted)]">Starts in: {election.startsInLabel}</p>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="chip">{election.category}</span>
                <span className="text-[var(--text-muted)]">{formatDate(election.startDate)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* My Activity */}
      <section>
        <h2 className="text-lg font-semibold mb-4 text-[var(--text)]">My Activity</h2>
        <div className="space-y-3">
          {activity.map((act) => (
            <div key={act.id} className="flex items-center justify-between p-4 card">
              <div>
                <p className="font-medium text-[var(--text)]">{act.title}</p>
                <p className="text-xs text-[var(--text-muted)]">{act.description}</p>
              </div>
              <span className="text-xs text-[var(--text-muted)]">{act.timeLabel}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
