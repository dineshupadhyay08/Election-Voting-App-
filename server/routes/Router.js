const { Router } = require("express");
const { registerVoterController, loginVoterController, getVoterController } = require("../controller/voterController");
const { addElection, getElectionVoters, getElections, removeElection, getCandidatesOfElection, updateElection } = require("../controller/electionController");
const { addCandidate, getCandidate, removeCandidate, voteCandidates } = require("../controller/candidatesController");

const router = Router();

router.post('/voters/register', registerVoterController);
router.post('/voters/login', loginVoterController);
router.get('/voters/:id', getVoterController);

router.post('/elections',addElection)
router.get('/elections',getElectionVoters)
router.get('/elections/:id',getElections)
router.delete('/elections/:id',removeElection)
router.patch('/elections/:id',updateElection)
router.get('/elections/:id/candidates',getCandidatesOfElection)
router.get('/elections/:id/voters',getElectionVoters)



router.post('/candidates',addCandidate)
router.get('/candidates/:id',getCandidate)
router.delete('/candidates/:id',removeCandidate)
router.patch('/candidates/:id',voteCandidates)



module.exports = router;
