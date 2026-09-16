const mongoose = require('mongoose');
const E = require('./model/electionModel');

const check = async () => {
    try {
        await mongoose.connect('mongodb+srv://hackerdk555_db_user:5vaiTHRSXs2iB6HK@votingapp.evdmyu5.mongodb.net/voting?retryWrites=true&w=majority&appName=VotingApp');
        console.log('Connected');
        const count = await E.countDocuments();
        console.log('Election Count:', count);
        const all = await E.find();
        console.log(JSON.stringify(all, null, 2));
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
};

check();
