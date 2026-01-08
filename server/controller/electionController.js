const Election = require("../model/electionModel");
const HttpError = require("../middleware/HttpError");

/* ================================
   ADD NEW ELECTION (ADMIN)
================================ */
const addElection = async (req, res, next) => {
  try {
    const { title, description, category, thumbnail, startDate, endDate } =
      req.body;

    // 🔴 Required field checks
    if (!title || !category || !startDate || !endDate) {
      return next(
        new HttpError(
          "Title, category, start date and end date are required",
          422
        )
      );
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return next(new HttpError("End date must be after start date", 422));
    }

    const election = await Election.create({
      title,
      description,
      category,
      thumbnail,
      startDate,
      endDate,
    });

    res.status(201).json(election);
  } catch (error) {
    console.error("ADD ELECTION ERROR:", error);
    next(new HttpError("Add election failed", 500));
  }
};

/* ================================
   GET ALL ELECTIONS (USERS)
   → supports filters & sorting
================================ */
const getElectionVoters = async (req, res, next) => {
  try {
    const { category, status, sort } = req.query;

    const query = { isActive: true };

    if (category) query.category = category;
    if (status) query.status = status;

    let sortOption = { createdAt: -1 };
    if (sort === "ENDING_SOON") {
      sortOption = { endDate: 1 };
    }

    const elections = await Election.find(query).sort(sortOption);

    res.json(elections);
  } catch (error) {
    console.error("FETCH ELECTIONS ERROR:", error);
    next(new HttpError("Fetching elections failed", 500));
  }
};

/* ================================
   GET SINGLE ELECTION
================================ */
const getElections = async (req, res, next) => {
  try {
    const election = await Election.findById(req.params.id);

    if (!election) {
      return next(new HttpError("Election not found", 404));
    }

    res.json(election);
  } catch (error) {
    console.error("GET ELECTION ERROR:", error);
    next(new HttpError("Fetching election failed", 500));
  }
};

/* ================================
   UPDATE ELECTION (ADMIN)
================================ */
const updateElection = async (req, res, next) => {
  try {
    const election = await Election.findById(req.params.id);

    if (!election) {
      return next(new HttpError("Election not found", 404));
    }

    const {
      title,
      description,
      category,
      thumbnail,
      startDate,
      endDate,
      isActive,
    } = req.body;

    if (title !== undefined) election.title = title;
    if (description !== undefined) election.description = description;
    if (category !== undefined) election.category = category;
    if (thumbnail !== undefined) election.thumbnail = thumbnail;
    if (startDate !== undefined) election.startDate = startDate;
    if (endDate !== undefined) election.endDate = endDate;
    if (isActive !== undefined) election.isActive = isActive;

    await election.save(); // status auto-update via schema hook

    res.json(election);
  } catch (error) {
    console.error("UPDATE ELECTION ERROR:", error);
    next(new HttpError("Update election failed", 500));
  }
};

/* ================================
   DELETE ELECTION (ADMIN)
================================ */
const removeElection = async (req, res, next) => {
  try {
    const election = await Election.findByIdAndDelete(req.params.id);

    if (!election) {
      return next(new HttpError("Election not found", 404));
    }

    res.json({ message: "Election deleted successfully" });
  } catch (error) {
    console.error("DELETE ELECTION ERROR:", error);
    next(new HttpError("Delete election failed", 500));
  }
};

/* ================================
   GET CANDIDATES OF ELECTION
================================ */
const getCandidatesOfElection = async (req, res, next) => {
  try {
    const election = await Election.findById(req.params.id).populate(
      "candidates"
    );

    if (!election) {
      return next(new HttpError("Election not found", 404));
    }

    res.json(election.candidates || []);
  } catch (error) {
    console.error("FETCH CANDIDATES ERROR:", error);
    next(new HttpError("Fetching candidates failed", 500));
  }
};

module.exports = {
  addElection,
  getElectionVoters,
  getElections,
  updateElection,
  removeElection,
  getCandidatesOfElection,
};
