const mongoose = require("mongoose");
const Candidate = require("../model/candidatesModel.js");
const Election = require("../model/electionModel.js");
const Vote = require("../model/voteModel.js");
const Voter = require("../model/voterModel.js");
const HttpError = require("../middleware/HttpError.js");

/* ================================
   ADD CANDIDATE (ADMIN)
================================ */
const addCandidate = async (req, res, next) => {
  try {
    console.log("ADD CANDIDATE - Request body:", req.body); // Debug log

    const {
      fullName,
      gender,
      age,
      mobileNumber,
      party,
      image,
      motto,
      election,
      address,
      goodWorks,
      experience,
    } = req.body;

    // Updated validation to match frontend requirements
    if (
      !fullName ||
      !gender ||
      !age ||
      !mobileNumber ||
      !party ||
      !address?.village ||
      !election
    ) {
      console.log("Missing required fields:", {
        fullName,
        gender,
        age,
        mobileNumber,
        party,
        village: address?.village,
        election,
      }); // Debug log
      return next(new HttpError("Missing required fields", 422));
    }

    const electionDoc = await Election.findById(election);
    if (!electionDoc) {
      return next(new HttpError("Election not found", 404));
    }

    const candidate = await Candidate.create({
      fullName,
      gender,
      age: Number(age), // Ensure age is a number
      mobileNumber,
      party,
      image: image || "",
      motto: motto || "",
      election: election,
      address,
      goodWorks: goodWorks || "",
      experience: experience || "",
    });

    electionDoc.candidates.push(candidate._id);
    await electionDoc.save();

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
    console.log("UPDATE CANDIDATE - Request body:", req.body); // Debug log

    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return next(new HttpError("Candidate not found", 404));
    }

    const {
      fullName,
      gender,
      age,
      mobileNumber,
      party,
      image,
      motto,
      address,
      goodWorks,
      experience,
    } = req.body;

    // Update fields if provided
    if (fullName !== undefined) candidate.fullName = fullName;
    if (gender !== undefined) candidate.gender = gender;
    if (age !== undefined) candidate.age = Number(age);
    if (mobileNumber !== undefined) candidate.mobileNumber = mobileNumber;
    if (party !== undefined) candidate.party = party;
    if (image !== undefined && image !== "") candidate.image = image;
    if (motto !== undefined) candidate.motto = motto;
    if (address !== undefined) candidate.address = address;
    if (goodWorks !== undefined) candidate.goodWorks = goodWorks || "";
    if (experience !== undefined) candidate.experience = experience;

    await candidate.save();
    res.json(candidate);
  } catch (error) {
    console.error("UPDATE CANDIDATE ERROR:", error);
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

    // Check if election exists
    const election = await Election.findById(candidate.election);
    if (!election) {
      return next(new HttpError("Election not found", 404));
    }

    // Remove candidate from election's candidates array
    election.candidates.pull(candidate._id);
    await election.save();

    // Delete the candidate
    await candidate.deleteOne();

    res.json({ message: "Candidate removed successfully" });
  } catch (error) {
    console.error("DELETE CANDIDATE ERROR:", error);
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
    const candidate = await Candidate.findById(req.params.id).populate(
      "election",
    );
    if (!candidate) {
      return next(new HttpError("Candidate not found", 404));
    }

    const election = candidate.election;
    if (!election) {
      return next(new HttpError("Election not found for this candidate", 404));
    }

    if (election.status !== "LIVE") {
      return next(
        new HttpError("Voting is only allowed for LIVE elections", 403),
      );
    }

    // Check if user has already voted in this election
    const Voter = require("../model/voterModel");
    const voter = await Voter.findById(req.user.id);
    if (!voter) {
      return next(new HttpError("Voter not found", 404));
    }

    if (voter.votedElections.includes(election._id)) {
      return next(
        new HttpError("You have already voted in this election", 403),
      );
    }

    // Record the vote
    candidate.voteCount += 1;
    await candidate.save();

    // Add voter to election's voters array
    election.voters.push(voter._id);
    await election.save();

    // Add election to voter's votedElections
    voter.votedElections.push(election._id);
    await voter.save();

    res.json({
      message: "Vote recorded successfully",
      votes: candidate.voteCount,
    });
  } catch (error) {
    console.error("VOTING ERROR:", error);
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
