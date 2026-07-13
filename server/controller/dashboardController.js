const Candidate = require("../model/candidatesModel");
const Election = require("../model/electionModel");
const Voter = require("../model/voterModel");
const HttpError = require("../middleware/HttpError");

const getElectionStatus = (election) => {
  const now = new Date();
  const startDate = new Date(election.startDate);
  const endDate = new Date(election.endDate);

  if (now < startDate) {
    return "UPCOMING";
  }

  if (now > endDate) {
    return "COMPLETED";
  }

  return "LIVE";
};

const getTimeDistance = (targetDate) => {
  const diff = new Date(targetDate).getTime() - Date.now();
  const clamped = Math.max(diff, 0);
  const hours = Math.floor(clamped / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  }

  const minutes = Math.floor((clamped % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};

const safeText = (value, fallback) => {
  if (!value || !String(value).trim()) {
    return fallback;
  }

  return String(value).trim();
};

const getDashboardOverview = async (req, res, next) => {
  try {
    const [voter, elections, candidates, voterCount] = await Promise.all([
      Voter.findById(req.user.id).select("-password").lean(),
      Election.find({ isActive: true }).populate("candidates").lean(),
      Candidate.find().populate("election", "title category startDate endDate").lean(),
      Voter.countDocuments(),
    ]);

    if (!voter) {
      return next(new HttpError("Voter not found", 404));
    }

    const normalizedElections = elections.map((election) => {
      const status = getElectionStatus(election);
      const candidateCount = election.candidates?.length || 0;
      const totalVotes = (election.candidates || []).reduce(
        (sum, candidate) => sum + (candidate.voteCount || 0),
        0,
      );
      const turnoutBase = Math.max(voterCount, 1);
      const turnoutRate = Math.min(
        100,
        Math.round(((election.voters?.length || 0) / turnoutBase) * 100),
      );

      return {
        ...election,
        status,
        candidateCount,
        totalVotes,
        turnoutRate,
      };
    });

    const liveElections = normalizedElections
      .filter((election) => election.status === "LIVE")
      .sort((left, right) => new Date(left.endDate) - new Date(right.endDate))
      .slice(0, 4)
      .map((election) => ({
        id: election._id,
        title: election.title,
        description: safeText(
          election.description,
          "Live monitoring active with candidate and turnout signals updating continuously.",
        ),
        status: election.status,
        endDate: election.endDate,
        turnoutRate: election.turnoutRate,
        remainingLabel: getTimeDistance(election.endDate),
        candidateCount: election.candidateCount,
      }));

    const upcomingElections = normalizedElections
      .filter((election) => election.status === "UPCOMING")
      .sort((left, right) => new Date(left.startDate) - new Date(right.startDate))
      .slice(0, 3)
      .map((election) => ({
        id: election._id,
        title: election.title,
        description: safeText(
          election.description,
          "Preparation window open for outreach, candidate validation, and voter readiness.",
        ),
        category: election.category,
        startDate: election.startDate,
        startsInLabel: getTimeDistance(election.startDate),
      }));

    const nextElection = upcomingElections[0] || liveElections[0] || null;
    const totalVotesCast = candidates.reduce(
      (sum, candidate) => sum + (candidate.voteCount || 0),
      0,
    );

    const featuredCandidates = candidates
      .sort((left, right) => (right.voteCount || 0) - (left.voteCount || 0))
      .slice(0, 4)
      .map((candidate) => ({
        id: candidate._id,
        fullName: candidate.fullName,
        party: candidate.party,
        image: candidate.image,
        education: candidate.address?.district || "Community profile",
        experience: safeText(candidate.experience, "Grassroots public service experience available on profile."),
        aiSummary: safeText(
          candidate.goodWorks,
          `${candidate.fullName} is showing momentum through local visibility and clear party alignment.`,
        ),
        manifestoPreview: safeText(candidate.motto, "Manifesto highlights will appear here when provided."),
        voteCount: candidate.voteCount || 0,
      }));

    const partyMap = new Map();
    candidates.forEach((candidate) => {
      const count = partyMap.get(candidate.party) || 0;
      partyMap.set(candidate.party, count + 1);
    });

    const partyShare = Array.from(partyMap.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((left, right) => right.value - left.value)
      .slice(0, 5);

    const categoryMix = normalizedElections.reduce((result, election) => {
      const existing = result.find((item) => item.label === election.category);

      if (existing) {
        existing.value += 1;
      } else {
        result.push({ label: election.category, value: 1 });
      }

      return result;
    }, []);

    const turnout = normalizedElections
      .slice(0, 6)
      .map((election) => ({
        label: election.title.split(" ").slice(0, 2).join(" "),
        turnout: election.turnoutRate,
      }));

    const recentElectionEvents = normalizedElections
      .sort((left, right) => new Date(right.updatedAt) - new Date(left.updatedAt))
      .slice(0, 4)
      .map((election) => ({
        id: `election-${election._id}`,
        title: `${election.title} refreshed`,
        description: `${election.candidateCount} candidates and ${election.turnoutRate}% turnout tracked in the current cycle.`,
        timeLabel: new Date(election.updatedAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }),
      }));

    const voterActivity = voter.votedElections.slice(0, 2).map((electionId, index) => ({
      id: `vote-${electionId}`,
      title: voter.isAdmin ? "Admin monitoring active" : "Vote history secured",
      description: voter.isAdmin
        ? "Administrative access is live with oversight over current election operations."
        : `Your participation has been recorded in ${index + 1} election cycle(s).`,
      timeLabel: "Recent",
    }));

    const participationRate = Math.min(
      100,
      Math.round((totalVotesCast / Math.max(voterCount, 1)) * 100),
    );

    res.json({
      hero: {
        summary: voter.isAdmin
          ? "Monitor turnout, identify bottlenecks, and steer the election system with a calmer, faster command surface."
          : "Track live elections, evaluate candidates, and take confident action from a dashboard designed for clarity and trust.",
        statusHeadline: liveElections.length
          ? `${liveElections.length} election${liveElections.length > 1 ? "s are" : " is"} live`
          : "No live elections in progress",
        priorityLabel: voter.isAdmin ? "Optimize turnout flow" : "Review live ballots",
      },
      stats: {
        liveElections: normalizedElections.filter((election) => election.status === "LIVE").length,
        upcomingElections: normalizedElections.filter((election) => election.status === "UPCOMING").length,
        totalCandidates: candidates.length,
        votesCast: totalVotesCast,
        participationRate,
        partyCount: partyMap.size,
        nextElectionStartsIn: nextElection
          ? "startDate" in nextElection
            ? getTimeDistance(nextElection.startDate)
            : getTimeDistance(nextElection.endDate)
          : "No schedule",
      },
      liveElections,
      upcomingElections,
      featuredCandidates,
      aiActions: voter.isAdmin
        ? [
            {
              title: "Compare turnout anomalies",
              description: "Spot regions where turnout is lagging and prioritize field coordination.",
            },
            {
              title: "Summarize candidate momentum",
              description: "Review which candidates are gaining attention across live elections.",
            },
            {
              title: "Prepare outreach prompts",
              description: "Generate concise updates for voters before the next election window opens.",
            },
          ]
        : [
            {
              title: "Compare candidates",
              description: "Get a concise breakdown of party, experience, and manifesto positioning.",
            },
            {
              title: "Understand live ballots",
              description: "Ask for a simple summary of which elections are live and what matters most.",
            },
            {
              title: "Smart search",
              description: "Use AI to narrow candidates by party, region, or campaign priorities.",
            },
          ],
      activity: [...voterActivity, ...recentElectionEvents].slice(0, 6),
      charts: {
        turnout,
        partyShare,
        categoryMix,
      },
      sidePanel: {
        countdown: nextElection
          ? {
              title: nextElection.title,
              label:
                "startDate" in nextElection
                  ? getTimeDistance(nextElection.startDate)
                  : getTimeDistance(nextElection.endDate),
              description:
                "startDate" in nextElection
                  ? "until the next scheduled election begins."
                  : "until the most urgent live election closes.",
            }
          : {
              title: "No milestone scheduled",
              label: "0h 00m",
              description: "Create or activate an election cycle to unlock dashboard countdowns.",
            },
        trending: normalizedElections.slice(0, 3).map((election) => ({
          id: election._id,
          title: election.title,
          signal: `${election.candidateCount} candidates and ${election.turnoutRate}% turnout signal`,
          status: election.status,
        })),
        suggestions: voter.isAdmin
          ? [
              {
                title: "Verify candidate density",
                description: "A few upcoming elections still have low candidate volume compared to the rest of the board.",
              },
              {
                title: "Promote voter outreach",
                description: "Participation can improve by nudging voters before live windows begin closing.",
              },
            ]
          : [
              {
                title: "Review top candidate summaries",
                description: "Use the AI summaries to shortlist candidates before you open a ballot.",
              },
              {
                title: "Check upcoming schedules",
                description: "Bookmark the next election window so you are ready when voting opens.",
              },
            ],
      },
    });
  } catch (error) {
    console.error("DASHBOARD OVERVIEW ERROR:", error);
    next(new HttpError("Fetching dashboard overview failed", 500));
  }
};

module.exports = { getDashboardOverview };
