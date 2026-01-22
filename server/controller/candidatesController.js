const Candidate = require("../model/candidatesModel.js");
const Election = require("../model/electionModel.js");
const HttpError = require("../middleware/HttpError.js");

/* ================================
   ADD CANDIDATE (ADMIN)
================================ */
const addCandidate = async (req, res, next) => {
  try {
    const {
      fullName,
      gender,
      mobileNumber,
      party,
      image,
      motto,
      electionId,
      fatherName,
      motherName,
      email,
      address,
      goodWorks,
      badWorks,
      experience,
    } = req.body;

    if (
      !fullName ||
      !gender ||
      !mobileNumber ||
      !party ||
      !image ||
      !motto ||
      !electionId
    ) {
      return next(new HttpError("Missing required fields", 422));
    }

    const election = await Election.findById(electionId);
    if (!election) {
      return next(new HttpError("Election not found", 404));
    }

    const candidate = await Candidate.create({
      fullName,
      gender,
      mobileNumber,
      party,
      image,
      motto,
      election: electionId,
      fatherName,
      motherName,
      email,
      address,
      goodWorks,
      badWorks,
      experience,
    });

    election.candidates.push(candidate._id);
    await election.save();

    res.status(201).json(candidate);
  } catch (error) {
    console.error("ADD CANDIDATE ERROR:", error);
    next(new HttpError("Add candidate failed", 500));
  }
};

/* ================================
   GET ALL CANDIDATES (OPTIONAL FILTERS)
================================ */

const getAllCandidates = async (req, res, next) => {
  try {
    const { electionId } = req.query;

    const query = {};
    if (electionId) {
      query.election = electionId;
    }

    const candidates = await Candidate.find(query)
      .populate("election", "title category status")
      .sort({ createdAt: -1 });

    res.json(candidates);
  } catch (error) {
    next(new HttpError("Fetching candidates failed", 500));
  }
};

module.exports = { getAllCandidates };

/* ================================
   GET SINGLE CANDIDATE
================================ */
const getCandidate = async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id).populate(
      "election",
    );

    if (!candidate) {
      return next(new HttpError("Candidate not found", 404));
    }

    res.json(candidate);
  } catch (error) {
    next(new HttpError("Fetching candidate failed", 500));
  }
};

/* ================================
   EDIT / UPDATE CANDIDATE (ADMIN)
================================ */

const updateCandidate = async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return next(new HttpError("Candidate not found", 404));
    }

    const {
      fullName,
      gender,
      fatherName,
      motherName,
      spouseName,
      mobileNumber,
      email,
      address,
      party,
      symbol,
      image,
      motto,
      goodWorks,
      badWorks,
      experience,
    } = req.body;

    if (fullName !== undefined) candidate.fullName = fullName;
    if (gender !== undefined) candidate.gender = gender;
    if (fatherName !== undefined) candidate.fatherName = fatherName;
    if (motherName !== undefined) candidate.motherName = motherName;
    if (spouseName !== undefined) candidate.spouseName = spouseName;
    if (mobileNumber !== undefined) candidate.mobileNumber = mobileNumber;
    if (email !== undefined) candidate.email = email;
    if (address !== undefined) candidate.address = address;
    if (party !== undefined) candidate.party = party;
    if (symbol !== undefined) candidate.symbol = symbol;
    if (image !== undefined) candidate.image = image;
    if (motto !== undefined) candidate.motto = motto;
    if (goodWorks !== undefined) candidate.goodWorks = goodWorks;
    if (badWorks !== undefined) candidate.badWorks = badWorks;
    if (experience !== undefined) candidate.experience = experience;

    await candidate.save();
    res.json(candidate);
  } catch (error) {
    next(new HttpError("Update candidate failed", 500));
  }
};

module.exports = { updateCandidate };

/* ================================
   DELETE CANDIDATE (ADMIN)
================================ */
const removeCandidate = async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return next(new HttpError("Candidate not found", 404));
    }

    await Election.findByIdAndUpdate(candidate.election, {
      $pull: { candidates: candidate._id },
    });

    await candidate.deleteOne();

    res.json({ message: "Candidate removed successfully" });
  } catch (error) {
    next(new HttpError("Delete candidate failed", 500));
  }
};

/* ================================
   GET PARTIES (USER)
================================ */
const getParties = async (req, res, next) => {
  try {
    const parties = await Candidate.aggregate([
      {
        $group: {
          _id: "$party",
          symbol: { $first: "$symbol" },
          candidateCount: { $sum: 1 },
        },
      },
      {
        $project: {
          party: "$_id",
          symbol: 1,
          candidateCount: 1,
        },
      },
    ]);

    res.json(parties);
  } catch (error) {
    console.error("AGGREGATION ERROR:", error);
    next(new HttpError("Fetching parties failed", 500));
  }
};

/* ================================
   VOTE CANDIDATE (USER)
================================ */
const voteCandidates = async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return next(new HttpError("Candidate not found", 404));
    }

    candidate.voteCount += 1;
    await candidate.save();

    res.json({ message: "Vote recorded", votes: candidate.voteCount });
  } catch (error) {
    next(new HttpError("Voting failed", 500));
  }
};

module.exports = {
  addCandidate,
  getAllCandidates,
  getCandidate,
  updateCandidate,
  removeCandidate,
  voteCandidates,
  getParties,
};
