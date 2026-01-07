const { Router } = require("express");

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
  removeElection,
  getCandidatesOfElection,
  updateElection,
} = require("../controller/electionController");

const {
  addCandidate,
  getCandidate,
  removeCandidate,
  voteCandidates,
} = require("../controller/candidatesController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = Router();

/* =========================
   AUTH (PUBLIC)
========================= */
router.post("/voters/register", registerVoterController);
router.post("/voters/login", loginVoterController);

/* =========================
   VOTER (PROTECTED)
========================= */
router.get("/voters/me", authMiddleware, getMyProfileController);
router.get("/voters/:id", authMiddleware, getVoterController);

/* =========================
   ELECTIONS
========================= */

// 🔐 Users – view elections
router.get("/elections", authMiddleware, getElectionVoters);
router.get("/elections/:id", authMiddleware, getElections);
router.get(
  "/elections/:id/candidates",
  authMiddleware,
  getCandidatesOfElection
);

// 👑 Admin – manage elections
router.post("/elections", adminMiddleware, authMiddleware, addElection);

router.patch("/elections/:id", adminMiddleware, authMiddleware, updateElection);

router.delete(
  "/elections/:id",
  authMiddleware,
  adminMiddleware,
  removeElection
);

/* =========================
   CANDIDATES
========================= */

// 👑 Admin – add/remove candidate
router.post("/candidates", adminMiddleware, authMiddleware, addCandidate);

router.delete(
  "/candidates/:id",
  authMiddleware,
  adminMiddleware,
  removeCandidate
);

// 🔐 User – view & vote
router.get("/candidates/:id", authMiddleware, getCandidate);
router.patch("/candidates/:id", authMiddleware, voteCandidates);

module.exports = router;
