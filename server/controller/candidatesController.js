


const addCandidate = (req,res,next)=>{
    res.json("Add Candidates")
}


const getCandidate = (req,res,next)=>{
    res.json("Get Candidate")
}


const removeCandidate = (req,res,next)=>{
    res.json("Delete Candidates")
}


const voteCandidates = (req,res,next)=>{
    res.json("Vote candidates")
}

module.exports = {addCandidate, getCandidate, removeCandidate, voteCandidates}