const { Router } = require("express");
const fileUpload = require("express-fileupload");

/* =========================
   CONTROLLERS
========================= */
const {
  registerVoterController,
  loginVoterController,
  logoutVoterController,
  getVoterController,
  getMyProfileController,
  updateVoterController,
} = require("../controller/voterController");
const { getDashboardOverview } = require("../controller/dashboardController");

const {
  addElection,
  getElectionVoters,
  getElections,
  updateElection,
  removeElection,
  getCandidatesOfElection,
  getElectionAnalytics,
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
router.post("/voters/logout", logoutVoterController);

/* ======================================================
   VOTER ROUTES (PROTECTED)
====================================================== */
router.get("/voters/me", authMiddleware, getMyProfileController);
router.put("/voters/update", authMiddleware, updateVoterController);
router.get("/voters/:id", authMiddleware, getVoterController);
router.get("/dashboard/overview", authMiddleware, getDashboardOverview);

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

/* 👑 ADMIN – ELECTION ANALYTICS */
router.get(
  "/elections/:id/analytics",
  authMiddleware,
  adminMiddleware,
  getElectionAnalytics,
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

/* 🔐 USER – GET PARTIES */
router.get("/parties", authMiddleware, getParties);

/* ================================
   UPLOAD ROUTE
================================ */
const cloudinary = require("../utils/cloudinary");

router.post("/upload", async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = req.files.file;
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "candidates",
    });

    res.json({ url: result.secure_url });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed" });
  }
});

module.exports = router;
