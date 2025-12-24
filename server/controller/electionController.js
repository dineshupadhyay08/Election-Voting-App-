

//*************ADD NEW ELECTION ********** */

const addElection = (req, res, next)=>{
    res.json("Add Election")
}

const getElections = (req,res,next)=>{
    res.json("Get single election")
}


const getCandidatesOfElection = (req,res,next)=>{
    res.json("Get Candidate of elections")
}



const getElectionVoters = (req,res,next)=>{
    res.json("Get Election")
}

const updateElection = (req,res,next)=>{
    res.json("Edit Election")
}


const removeElection = (req,res,next)=>{
    res.json("Delete election")
}


module.exports = {addElection, removeElection, updateElection, getElectionVoters, getElections,getCandidatesOfElection}