const Election = require("../model/electionModel");
const HttpError = require("../middleware/HttpError");

/* ================================
   ADD NEW ELECTION (ADMIN)
================================ */
const addElection = async (req, res, next) => {
  try {
    const { title, electionDate } = req.body;

    if (!title) {
      return next(new HttpError("Election title required", 422));
    }

    const election = await Election.create({
      title,
      electionDate: electionDate || null,
    });

    res.status(201).json(election);
  } catch (error) {
    next(new HttpError("Add election failed", 500));
  }
};

/* ================================
   GET ALL ELECTIONS (USERS)
================================ */
const getElectionVoters = async (req, res, next) => {
  try {
    const elections = await Election.find().sort({ createdAt: -1 });
    res.json(elections);
  } catch (error) {
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
    next(new HttpError("Fetching election failed", 500));
  }
};

/* ================================
   UPDATE ELECTION (ADMIN)
   → SET DATE / TITLE
================================ */
const updateElection = async (req, res, next) => {
  try {
    const election = await Election.findById(req.params.id);
    if (!election) {
      return next(new HttpError("Election not found", 404));
    }

    election.title = req.body.title || election.title;
    election.electionDate = req.body.electionDate || election.electionDate;

    await election.save();
    res.json(election);
  } catch (error) {
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
    next(new HttpError("Fetching candidates failed", 500));
  }
};

module.exports = {
  addElection,
  removeElection,
  updateElection,
  getElectionVoters,
  getElections,
  getCandidatesOfElection,
};
