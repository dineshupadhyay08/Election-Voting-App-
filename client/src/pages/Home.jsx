import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowRight,
  Bookmark,
  Bot,
  CalendarClock,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users2,
  Vote,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import api from "../store/axios";
import { useAuth } from "../context/AuthContext";

const accentPalette = ["var(--chart-accent)", "#fcd34d", "#fde68a", "#fffbeb", "#fef3c7"];
const chartAxisColor = "var(--chart-tick)";
const chartGridColor = "var(--chart-grid)";
const chartTooltipStyle = {
  background: "var(--chart-tooltip-bg)",
  border: "1px solid var(--chart-tooltip-border)",
  borderRadius: 16,
  color: "var(--text)",
  boxShadow: "var(--shadow)",
};

const fetchDashboardOverview = async () => {
  const { data } = await api.get("/dashboard/overview");
  return data;
};

const formatNumber = (value) => new Intl.NumberFormat("en-IN").format(value || 0);

const formatDate = (value) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

const cardMotion = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay },
  }),
};

const StatCard = ({ item, index }) => {
  const Icon = item.icon;

  return (
    <motion.div
      custom={index * 0.06}
      initial="hidden"
      animate="visible"
      variants={cardMotion}
      className="card p-5 sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
            {item.label}
          </p>
          <h3 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight">
            {item.value}
          </h3>
          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-text-muted">
            {item.detail}
          </p>
        </div>
        <div className="glass rounded-2xl p-3 flex-shrink-0">
          <Icon size={20} style={{ color: 'var(--brand-primary)' }} />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs sm:text-sm" style={{ color: 'var(--brand-primary)' }}>
        <TrendingUp size={14} />
        <span>{item.trend}</span>
      </div>
    </motion.div>
  );
};

const SectionHeading = ({ eyebrow, title, action }) => (
  <div className="flex items-end justify-between gap-4">
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight">
        {title}
      </h2>
    </div>
    {action ? (
      <button type="button" className="btn-secondary text-xs sm:text-sm">
        {action}
        <ArrowRight size={16} />
      </button>
    ) : null}
  </div>
);

const DashboardSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="card h-64 rounded-xl"></div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="card h-40 rounded-xl"></div>
      ))}
    </div>
  </div>
);

const DashboardError = ({ onRetry }) => (
  <div className="card p-8 flex flex-col items-center justify-center text-center">
    <div className="glass rounded-2xl p-4 mb-4">
      <AlertTriangle size={28} style={{ color: 'var(--status-error)' }} />
    </div>
    <h2 className="text-lg sm:text-xl font-semibold">Unable to Load Dashboard</h2>
    <p className="mt-2 text-sm text-text-muted max-w-md">
      We couldn't fetch your dashboard data. Please try again.
    </p>
    <button onClick={onRetry} className="btn-primary mt-6">
      Retry
    </button>
  </div>
);

const Home = () => {
  const { user } = useAuth();
  const dashboardQuery = useQuery({
    queryKey: ["dashboard-overview"],
    queryFn: fetchDashboardOverview,
  });

  const currentDate = useMemo(
    () =>
      new Intl.DateTimeFormat("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date()),
    [],
  );

  if (dashboardQuery.isLoading) {
    return <DashboardSkeleton />;
  }

  if (dashboardQuery.isError) {
    return <DashboardError onRetry={() => dashboardQuery.refetch()} />;
  }

  const overview = dashboardQuery.data;

  const statCards = [
    {
      label: "Live elections",
      value: formatNumber(overview.stats.liveElections),
      detail: "Active races accepting votes",
      trend: `${overview.stats.liveElections} active now`,
      icon: Vote,
    },
    {
      label: "Upcoming elections",
      value: formatNumber(overview.stats.upcomingElections),
      detail: "Scheduled for future voting",
      trend: `${overview.stats.nextElectionStartsIn} until next`,
      icon: CalendarClock,
    },
    {
      label: "Total candidates",
      value: formatNumber(overview.stats.totalCandidates),
      detail: "Across all active elections",
      trend: `${overview.stats.partyCount} parties`,
      icon: Users2,
    },
    {
      label: "Participation rate",
      value: `${overview.stats.participationRate}%`,
      detail: "Cross-election turnout benchmark",
      trend: `${formatNumber(overview.stats.votesCast)} votes cast`,
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="space-y-6 lg:space-y-8 animate-fade-in">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card-lg p-6 sm:p-8"
      >
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--brand-primary)' }}>
            Welcome back
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">
            {user?.isAdmin ? "Election Command Center" : "Your Voting Dashboard"}
          </h1>
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-text-soft">
            {overview.hero.summary}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 mt-6">
          <div className="glass rounded-xl p-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-text-muted">
              Today
            </span>
            <strong className="mt-2 block text-base font-semibold">
              {currentDate}
            </strong>
          </div>
          <div className="glass rounded-xl p-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-text-muted">
              Election Status
            </span>
            <strong className="mt-2 block text-base font-semibold">
              {overview.hero.statusHeadline}
            </strong>
          </div>
          <div className="glass rounded-xl p-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-text-muted">
              Priority
            </span>
            <strong className="mt-2 block text-base font-semibold">
              {overview.hero.priorityLabel}
            </strong>
          </div>
        </div>
      </motion.section>

      {/* Stats Cards */}
      <section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((item, index) => (
            <StatCard key={item.label} item={item} index={index} />
          ))}
        </div>
      </section>

      {/* Live Elections */}
      {overview.liveElections.length > 0 && (
        <section className="card-lg p-6 sm:p-8">
          <SectionHeading
            eyebrow="Live Elections"
            title="Active races accepting votes now"
          />
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {overview.liveElections.map((election, index) => (
              <motion.div
                key={election.id}
                custom={index * 0.08}
                initial="hidden"
                animate="visible"
                variants={cardMotion}
                className="glass rounded-xl p-5"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="badge-live">● LIVE</span>
                    <h3 className="mt-3 text-lg font-semibold">{election.title}</h3>
                  </div>
                  <Clock3 size={18} style={{ color: 'var(--brand-primary)' }} className="flex-shrink-0 mt-1" />
                </div>
                <p className="text-sm text-text-muted mb-4">
                  {election.description}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span>Turnout Progress</span>
                    <span className="font-medium">{election.turnoutRate}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--chart-grid)' }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        backgroundImage: 'linear-gradient(to right, var(--brand-primary-light), var(--chart-accent))',
                        width: `${Math.max(election.turnoutRate, 8)}%`
                      }}
                    />
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                  <div className="glass rounded-lg p-2 text-center">
                    <p className="text-text-muted">Ends</p>
                    <p className="font-medium mt-1">{formatDate(election.endDate)}</p>
                  </div>
                  <div className="glass rounded-lg p-2 text-center">
                    <p className="text-text-muted">Countdown</p>
                    <p className="font-medium mt-1">{election.remainingLabel}</p>
                  </div>
                  <div className="glass rounded-lg p-2 text-center">
                    <p className="text-text-muted">Candidates</p>
                    <p className="font-medium mt-1">{election.candidateCount}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Participation Analytics */}
        {overview.charts?.turnout && (
          <section className="card-lg p-6 sm:p-8">
            <SectionHeading
              eyebrow="Participation Analytics"
              title="Turnout trends"
            />
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={overview.charts.turnout}>
                  <defs>
                    <linearGradient id="turnoutGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-accent)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--chart-accent)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={chartGridColor} vertical={false} />
                  <XAxis dataKey="label" stroke={chartAxisColor} tickLine={false} />
                  <YAxis stroke={chartAxisColor} tickLine={false} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Area
                    type="monotone"
                    dataKey="turnout"
                    stroke="var(--chart-accent)"
                    fill="url(#turnoutGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        {/* Party Distribution */}
        {overview.charts?.partyShare && (
          <section className="card-lg p-6 sm:p-8">
            <SectionHeading
              eyebrow="Party Distribution"
              title="Candidate spread"
            />
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={overview.charts.partyShare}
                    dataKey="value"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {overview.charts.partyShare.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={accentPalette[index % accentPalette.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={chartTooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}
      </div>

      {/* Upcoming Elections */}
      {overview.upcomingElections?.length > 0 && (
        <section className="card-lg p-6 sm:p-8">
          <SectionHeading
            eyebrow="Upcoming Elections"
            title="Next on the national calendar"
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {overview.upcomingElections.map((election, index) => (
              <motion.div
                key={election.id}
                custom={index * 0.08}
                initial="hidden"
                animate="visible"
                variants={cardMotion}
                className="glass rounded-xl p-5"
              >
                <span className="badge-warning">{election.category}</span>
                <h3 className="mt-3 text-base font-semibold">{election.title}</h3>
                <p className="mt-2 text-xs text-text-muted line-clamp-2">
                  {election.description}
                </p>
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Starts</span>
                    <span className="font-medium">{formatDate(election.startDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Countdown</span>
                    <span className="font-medium">{election.startsInLabel}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
