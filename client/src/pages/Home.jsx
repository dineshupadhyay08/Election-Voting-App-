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

const accentPalette = ["#38bdf8", "#818cf8", "#22c55e", "#f59e0b", "#f97316"];
const chartAxisColor = "var(--chart-axis)";
const chartGridColor = "var(--chart-grid)";
const chartTooltipStyle = {
  background: "var(--tooltip-bg)",
  border: "1px solid var(--tooltip-border)",
  borderRadius: 16,
  color: "var(--text-primary)",
  boxShadow: "var(--shadow-soft)",
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
    <motion.article
      custom={index * 0.06}
      initial="hidden"
      animate="visible"
      variants={cardMotion}
      className="dashboard-card dashboard-card-glow flex h-full min-h-[208px] flex-col"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="dashboard-label">{item.label}</p>
          <h3 className="mt-4 text-3xl font-semibold tracking-tight sm:text-[2rem]">{item.value}</h3>
          <p className="mt-3 max-w-[28ch] text-sm leading-6 text-[var(--text-secondary)]">{item.detail}</p>
        </div>
        <div className="dashboard-icon-wrap dashboard-icon-wrap-lg">
          <Icon size={20} strokeWidth={2} />
        </div>
      </div>
      <div className="mt-auto flex items-center gap-2 pt-8 text-sm text-[var(--status-success)]">
        <TrendingUp size={16} strokeWidth={2} />
        <span>{item.trend}</span>
      </div>
    </motion.article>
  );
};

const SectionHeading = ({ eyebrow, title, action }) => (
  <div className="flex items-end justify-between gap-4">
    <div>
      <p className="dashboard-label">{eyebrow}</p>
      <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
    </div>
    {action ? (
      <button type="button" className="dashboard-inline-button">
        {action}
        <ArrowRight size={16} strokeWidth={2} />
      </button>
    ) : null}
  </div>
);

const CandidateCard = ({ candidate, index }) => (
  <motion.article
    key={candidate.id}
    custom={index * 0.08}
    initial="hidden"
    animate="visible"
    variants={cardMotion}
    className="dashboard-panel flex h-full min-h-[420px] flex-col"
  >
    <div className="flex items-start gap-4">
      <img
        src={candidate.image || "/Vote.jpg"}
        alt={candidate.fullName}
        className="h-20 w-20 shrink-0 rounded-[24px] border border-[var(--border-soft)] object-cover sm:h-24 sm:w-24"
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="dashboard-badge">{candidate.party}</span>
          <span className="dashboard-badge dashboard-badge-muted">
            <GraduationCap size={12} strokeWidth={2} />
            {candidate.education}
          </span>
        </div>
        <h3 className="mt-4 text-lg font-semibold sm:text-xl">{candidate.fullName}</h3>
        <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)] dashboard-clamp-2">
          {candidate.experience}
        </p>
      </div>
      <button type="button" className="dashboard-icon-button shrink-0" aria-label={`Save ${candidate.fullName}`}>
        <Bookmark size={16} strokeWidth={2} />
      </button>
    </div>

    <div className="mt-5 grid gap-3 sm:grid-cols-2">
      <div className="dashboard-subcard">
        <p className="dashboard-label">Experience</p>
        <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)] dashboard-clamp-3">
          {candidate.experience}
        </p>
      </div>
      <div className="dashboard-subcard">
        <p className="dashboard-label">Votes</p>
        <p className="mt-2 text-sm font-medium text-[var(--text-primary)]">
          {formatNumber(candidate.voteCount)}
        </p>
      </div>
    </div>

    <div className="mt-5 rounded-[24px] border border-[var(--accent-border)] bg-[var(--accent-surface)] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-strong)]">
        AI summary
      </p>
      <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)] dashboard-clamp-4">
        {candidate.aiSummary}
      </p>
    </div>

    <div className="mt-5 dashboard-subcard">
      <p className="dashboard-label">Manifesto preview</p>
      <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)] dashboard-clamp-3">
        {candidate.manifestoPreview}
      </p>
    </div>

    <div className="mt-auto flex flex-wrap gap-3 pt-5">
      <button type="button" className="dashboard-secondary-button">
        <Sparkles size={16} strokeWidth={2} />
        AI Summary
      </button>
      <button type="button" className="dashboard-primary-button">
        View profile
      </button>
    </div>
  </motion.article>
);

const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_360px]">
      <div className="space-y-6">
        <div className="dashboard-skeleton h-56" />
        <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="dashboard-skeleton h-40" />
          ))}
        </div>
        <div className="dashboard-skeleton h-80" />
        <div className="dashboard-skeleton h-96" />
      </div>
      <div className="space-y-6">
        <div className="dashboard-skeleton h-64" />
        <div className="dashboard-skeleton h-72" />
        <div className="dashboard-skeleton h-72" />
      </div>
    </div>
  </div>
);

const DashboardError = ({ onRetry }) => (
  <div className="dashboard-card flex min-h-[420px] flex-col items-center justify-center text-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--danger-soft)] text-[var(--danger-text)]">
      <AlertTriangle size={28} strokeWidth={2} />
    </div>
    <h2 className="mt-6 text-2xl font-semibold">Dashboard data is temporarily unavailable</h2>
    <p className="mt-3 max-w-xl text-sm text-[var(--text-secondary)]">
      The workspace loaded correctly, but the new overview endpoint did not respond yet.
      Retry to refresh the command center.
    </p>
    <button type="button" className="dashboard-primary-button mt-6" onClick={onRetry}>
      Reload dashboard
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
      detail: "Critical races currently accepting verified votes.",
      trend: `${overview.stats.liveElections} active right now`,
      icon: Vote,
    },
    {
      label: "Upcoming windows",
      value: formatNumber(overview.stats.upcomingElections),
      detail: "Configured elections preparing for voter outreach and onboarding.",
      trend: `${overview.stats.nextElectionStartsIn} until next launch`,
      icon: CalendarClock,
    },
    {
      label: "Candidate network",
      value: formatNumber(overview.stats.totalCandidates),
      detail: "Candidates currently visible across all active election cycles.",
      trend: `${overview.stats.partyCount} parties participating`,
      icon: Users2,
    },
    {
      label: "Participation rate",
      value: `${overview.stats.participationRate}%`,
      detail: "Cross-election turnout benchmark measured against registered users.",
      trend: `${formatNumber(overview.stats.votesCast)} votes recorded`,
      icon: ShieldCheck,
    },
  ];

  return (
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_360px]">
      <div className="space-y-6">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="dashboard-hero"
        >
          <div className="max-w-2xl">
            <p className="dashboard-label">Welcome back</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              {user?.isAdmin ? "Election command center" : "Your voting mission control"}
            </h1>
            <p className="mt-4 text-sm leading-7 text-[var(--hero-text)] sm:text-base">
              {overview.hero.summary}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="dashboard-metric-tile">
              <span className="dashboard-label">Today</span>
              <strong className="mt-3 block text-lg font-semibold">{currentDate}</strong>
            </div>
            <div className="dashboard-metric-tile">
              <span className="dashboard-label">Election status</span>
              <strong className="mt-3 block text-lg font-semibold">{overview.hero.statusHeadline}</strong>
            </div>
            <div className="dashboard-metric-tile">
              <span className="dashboard-label">Priority</span>
              <strong className="mt-3 block text-lg font-semibold">{overview.hero.priorityLabel}</strong>
            </div>
          </div>
        </motion.section>

        <section className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
          {statCards.map((item, index) => (
            <StatCard key={item.label} item={item} index={index} />
          ))}
        </section>

        <section className="dashboard-card">
          <SectionHeading
            eyebrow="Live elections"
            title="High-signal races with real-time readiness context"
            action="Open election board"
          />
          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {overview.liveElections.length ? (
              overview.liveElections.map((election, index) => (
                <motion.article
                  key={election.id}
                  custom={index * 0.08}
                  initial="hidden"
                  animate="visible"
                  variants={cardMotion}
                  className="dashboard-panel flex h-full min-h-[320px] flex-col p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="dashboard-badge dashboard-badge-success">
                        {election.status}
                      </div>
                      <h3 className="mt-4 text-xl font-semibold">{election.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)] dashboard-clamp-3">
                        {election.description}
                      </p>
                    </div>
                    <div className="dashboard-icon-wrap">
                      <Clock3 size={18} strokeWidth={2} />
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between text-sm text-[var(--text-secondary)]">
                      <span>Turnout progress</span>
                      <span>{election.turnoutRate}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-[var(--progress-track)]">
                      <div
                        className="h-full rounded-full bg-[var(--brand-gradient)]"
                        style={{ width: `${Math.max(election.turnoutRate, 8)}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <div className="dashboard-subcard">
                      <p className="dashboard-label">Ends</p>
                      <p className="mt-2 text-sm font-medium">{formatDate(election.endDate)}</p>
                    </div>
                    <div className="dashboard-subcard">
                      <p className="dashboard-label">Countdown</p>
                      <p className="mt-2 text-sm font-medium">{election.remainingLabel}</p>
                    </div>
                    <div className="dashboard-subcard">
                      <p className="dashboard-label">Candidates</p>
                      <p className="mt-2 text-sm font-medium">{election.candidateCount}</p>
                    </div>
                  </div>

                  <div className="mt-auto flex flex-wrap gap-3 pt-6">
                    <button type="button" className="dashboard-primary-button">
                      View details
                    </button>
                    <button type="button" className="dashboard-secondary-button">
                      Vote now
                    </button>
                  </div>
                </motion.article>
              ))
            ) : (
              <div className="dashboard-empty-state xl:col-span-2">
                <CheckCircle2 size={24} />
                <h3 className="mt-4 text-lg font-semibold">No live elections right now</h3>
                <p className="mt-2 max-w-md text-sm text-[var(--text-secondary)]">
                  The system is ready, but there are no active election windows at the moment.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_minmax(320px,380px)]">
          <div className="dashboard-card">
            <SectionHeading
              eyebrow="Featured candidates"
              title="Campaign intelligence curated for fast evaluation"
              action="See all candidates"
            />
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-2">
              {overview.featuredCandidates.length ? (
                overview.featuredCandidates.map((candidate, index) => (
                  <CandidateCard key={candidate.id} candidate={candidate} index={index} />
                ))
              ) : (
                <div className="dashboard-empty-state xl:col-span-2">
                  <Users2 size={24} strokeWidth={2} />
                  <h3 className="mt-4 text-lg font-semibold">Candidate spotlight is empty</h3>
                  <p className="mt-2 max-w-md text-sm text-[var(--text-secondary)]">
                    Add candidates to an election and the dashboard will surface them here automatically.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <section className="dashboard-card">
              <SectionHeading eyebrow="AI workspace" title="Fast workflows for informed decisions" />
              <div className="mt-6 space-y-3">
                {overview.aiActions.map((action) => (
                  <div key={action.title} className="dashboard-panel p-4">
                    <div className="flex items-start gap-3">
                      <div className="dashboard-icon-wrap">
                        <Bot size={18} strokeWidth={2} />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold">{action.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{action.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="dashboard-card">
              <SectionHeading eyebrow="Recent activity" title="Timeline of the latest platform events" />
              <div className="mt-6 space-y-5">
                {overview.activity.length ? (
                  overview.activity.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="mt-1 h-3 w-3 rounded-full bg-[var(--status-info)] shadow-[0_0_0_6px_var(--accent-soft)]" />
                      <div className="flex-1 border-b border-[var(--border-soft)] pb-5 last:border-b-0">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="text-sm font-semibold">{item.title}</h3>
                          <span className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                            {item.timeLabel}
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{item.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="dashboard-empty-state">
                    <Clock3 size={24} strokeWidth={2} />
                    <h3 className="mt-4 text-lg font-semibold">No recent activity yet</h3>
                    <p className="mt-2 max-w-md text-sm text-[var(--text-secondary)]">
                      Once elections and votes start flowing, your activity stream will appear here.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="dashboard-card">
            <SectionHeading eyebrow="Participation analytics" title="Turnout by active election" />
            <div className="mt-6 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={overview.charts.turnout}>
                  <defs>
                    <linearGradient id="turnoutGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.55} />
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={chartGridColor} vertical={false} />
                  <XAxis dataKey="label" stroke={chartAxisColor} tickLine={false} axisLine={false} />
                  <YAxis stroke={chartAxisColor} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Area type="monotone" dataKey="turnout" stroke="var(--status-info)" fill="url(#turnoutGradient)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="dashboard-card">
            <SectionHeading eyebrow="Party distribution" title="Candidate spread across the current cycle" />
            <div className="mt-6 grid items-center gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
              <div className="mx-auto h-[220px] w-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={overview.charts.partyShare}
                      dataKey="value"
                      innerRadius={62}
                      outerRadius={92}
                      paddingAngle={3}
                    >
                      {overview.charts.partyShare.map((entry, index) => (
                        <Cell key={entry.label} fill={accentPalette[index % accentPalette.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={chartTooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3">
                {overview.charts.partyShare.map((entry, index) => (
                  <div
                    key={entry.label}
                    className="flex items-center justify-between rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-2)] px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: accentPalette[index % accentPalette.length] }}
                      />
                      <span className="text-sm font-medium">{entry.label}</span>
                    </div>
                    <span className="text-sm text-[var(--text-secondary)]">{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-card">
          <SectionHeading eyebrow="Upcoming elections" title="What is next on the national calendar" />
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {overview.upcomingElections.length ? (
              overview.upcomingElections.map((election, index) => (
                <motion.article
                  key={election.id}
                  custom={index * 0.08}
                  initial="hidden"
                  animate="visible"
                  variants={cardMotion}
                  className="dashboard-panel flex h-full min-h-[220px] flex-col p-5"
                >
                  <div className="dashboard-badge">
                    {election.category}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{election.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)] dashboard-clamp-3">{election.description}</p>
                  <div className="mt-5 space-y-3 text-sm text-[var(--text-secondary)]">
                    <div className="flex items-center justify-between">
                      <span>Starts</span>
                      <span>{formatDate(election.startDate)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Countdown</span>
                      <span>{election.startsInLabel}</span>
                    </div>
                  </div>
                </motion.article>
              ))
            ) : (
              <div className="dashboard-empty-state lg:col-span-3">
                <CalendarClock size={24} strokeWidth={2} />
                <h3 className="mt-4 text-lg font-semibold">No upcoming elections scheduled</h3>
                <p className="mt-2 max-w-md text-sm text-[var(--text-secondary)]">
                  Create a new election cycle and it will appear in this planning panel.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      <aside className="min-w-0 space-y-6">
        <section className="dashboard-card">
          <SectionHeading eyebrow="Countdown" title="Next critical election milestone" />
          <div className="mt-6 rounded-[28px] border border-[var(--accent-border)] bg-[var(--brand-gradient-soft)] p-5">
            <p className="text-sm text-[var(--hero-text)] dashboard-clamp-2">{overview.sidePanel.countdown.title}</p>
            <h3 className="mt-4 text-4xl font-semibold text-white">{overview.sidePanel.countdown.label}</h3>
            <p className="mt-4 text-sm leading-6 text-[var(--hero-text-soft)]">{overview.sidePanel.countdown.description}</p>
          </div>
        </section>

        <section className="dashboard-card">
          <SectionHeading eyebrow="Trending elections" title="Where attention is building fastest" />
          <div className="mt-6 space-y-3">
            {overview.sidePanel.trending.length ? (
              overview.sidePanel.trending.map((item) => (
                <div key={item.id} className="dashboard-panel p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="dashboard-clamp-1 text-sm font-semibold">{item.title}</h3>
                      <p className="mt-2 text-sm text-[var(--text-secondary)] dashboard-clamp-2">{item.signal}</p>
                    </div>
                    <span className="dashboard-badge dashboard-badge-muted shrink-0">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="dashboard-empty-state">
                <Sparkles size={24} strokeWidth={2} />
                <h3 className="mt-4 text-lg font-semibold">No trending elections yet</h3>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  Trends will appear after candidate and voter activity increases.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="dashboard-card">
          <SectionHeading eyebrow="Suggestions" title="Intelligent nudges for the next best action" />
          <div className="mt-6 space-y-3">
            {overview.sidePanel.suggestions.map((item) => (
              <div key={item.title} className="dashboard-panel p-4">
                <div className="flex items-start gap-3">
                  <div className="dashboard-icon-wrap">
                    <Lightbulb size={18} strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-card">
          <SectionHeading eyebrow="Regional balance" title="Election volume by category" />
          <div className="mt-6 h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overview.charts.categoryMix} barSize={26}>
                <CartesianGrid stroke={chartGridColor} vertical={false} />
                <XAxis dataKey="label" stroke={chartAxisColor} tickLine={false} axisLine={false} />
                <YAxis stroke={chartAxisColor} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Bar dataKey="value" radius={[12, 12, 0, 0]} fill="var(--chart-bar)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </aside>
    </div>
  );
};

export default Home;
