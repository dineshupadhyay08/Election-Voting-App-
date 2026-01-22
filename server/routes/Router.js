const { Router } = require("express");

/* =========================
   CONTROLLERS
========================= */
const {
  registerVoterController,
  loginVoterController,
  getVoterController,
  getMyProfileController,
} = require("../controller/voterController");

const {
  addElection,
  getElectionVoters,
  getElections,
  updateElection,
  removeElection,
  getCandidatesOfElection,
} = require("../controller/electionController");

const {
  addCandidate,
  getCandidate,
  removeCandidate,
  voteCandidates,
  getAllCandidates,
  updateCandidate,
  getParties,
} = require("../controller/candidatesController");

/* =========================
   MIDDLEWARE
========================= */
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = Router();

/* ======================================================
   AUTH ROUTES (PUBLIC)
====================================================== */
router.post("/voters/register", registerVoterController);
router.post("/voters/login", loginVoterController);

/* ======================================================
   VOTER ROUTES (PROTECTED)
====================================================== */
router.get("/voters/me", authMiddleware, getMyProfileController);
router.get("/voters/:id", authMiddleware, getVoterController);

/* ======================================================
   ELECTION ROUTES
====================================================== */

/* 🔐 USERS – VIEW ELECTIONS (FILTERS SUPPORTED)
   Example:
   /elections?status=LIVE
   /elections?category=PANCHAYAT
   /elections?sort=ENDING_SOON
*/
router.get("/elections", authMiddleware, getElectionVoters);

/* 🔐 USER – SINGLE ELECTION */
router.get("/elections/:id", authMiddleware, getElections);

/* 🔐 USER – CANDIDATES OF ELECTION */
router.get(
  "/elections/:id/candidates",
  authMiddleware,
  getCandidatesOfElection,
);

/* 👑 ADMIN – CREATE ELECTION */
router.post("/elections", authMiddleware, adminMiddleware, addElection);

/* 👑 ADMIN – UPDATE ELECTION */
router.patch("/elections/:id", authMiddleware, adminMiddleware, updateElection);

/* 👑 ADMIN – DELETE ELECTION */
router.delete(
  "/elections/:id",
  authMiddleware,
  adminMiddleware,
  removeElection,
);

/* ======================================================
   CANDIDATE ROUTES
====================================================== */

router.get("/candidates", authMiddleware, getAllCandidates);

/* 👑 ADMIN – ADD CANDIDATE */
router.post("/candidates", authMiddleware, adminMiddleware, addCandidate);

/* 👑 ADMIN – REMOVE CANDIDATE */
router.delete(
  "/candidates/:id",
  authMiddleware,
  adminMiddleware,
  removeCandidate,
);

router.patch(
  "/candidates/:id",
  authMiddleware,
  adminMiddleware,
  updateCandidate,
);

/* 🔐 USER – VIEW CANDIDATE */
router.get("/candidates/:id", authMiddleware, getCandidate);

/* 🔐 USER – VOTE */
router.patch("/candidates/:id/vote", authMiddleware, voteCandidates);

module.exports = router;
