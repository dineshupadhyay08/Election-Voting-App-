const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcryptjs");

// Load environment variables from server/.env (same as index.js)
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const VoterModel = require("../model/voterModel");
const ElectionModel = require("../model/electionModel");
const CandidateModel = require("../model/candidatesModel");

const seedData = async () => {
    try {
        // Verify environment variables are loaded
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not set in environment variables. Check server/.env");
        }

        console.log("Connecting to MongoDB Atlas database...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to database successfully");

        // 1. Seed Voters
        const hashedPassword = await bcrypt.hash("Test@12345", 10);
        const voters = [
            { fullName: "Alice River", email: "voter1@test.elector", password: hashedPassword, mobile_number: 9999999991 },
            { fullName: "Bob Field", email: "voter2@test.elector", password: hashedPassword, mobile_number: 9999999992 },
            { fullName: "Charlie Green", email: "voter3@test.elector", password: hashedPassword, mobile_number: 9999999993 },
            { fullName: "Diana Road", email: "voter4@test.elector", password: hashedPassword, mobile_number: 9999999994 },
            { fullName: "Edward Hill", email: "voter5@test.elector", password: hashedPassword, mobile_number: 9999999995 },
        ];

        for (let v of voters) {
            await VoterModel.findOneAndUpdate({ email: v.email }, v, { upsert: true, new: true });
        }
        console.log("✅ Voters seeded (5 total)");

        // 2. Seed Elections
        const electionData = [
            {
                _id: new mongoose.Types.ObjectId("666666666666666666666661"),
                title: "Riverdale Community Council Election 2026",
                description: "Live election for Riverdale community leadership.",
                category: "PANCHAYAT",
                startDate: new Date("2026-09-01"),
                endDate: new Date("2026-09-30"),
                status: "LIVE",
                thumbnail: "https://via.placeholder.com/300x200?text=Riverdale+Election",
                isActive: true,
                candidates: [],
            },
            {
                _id: new mongoose.Types.ObjectId("666666666666666666666662"),
                title: "Greenfield Development Committee Election 2026",
                description: "Upcoming election for Greenfield development oversight.",
                category: "PANCHAYAT",
                startDate: new Date("2026-10-01"),
                endDate: new Date("2026-10-30"),
                status: "UPCOMING",
                thumbnail: "https://via.placeholder.com/300x200?text=Greenfield+Election",
                isActive: true,
                candidates: [],
            },
        ];

        const elections = [];
        for (let e of electionData) {
            const result = await ElectionModel.findOneAndUpdate({ _id: e._id }, e, { upsert: true, new: true });
            elections.push(result);
        }
        console.log("✅ Elections seeded (2 total)");

        // 3. Seed Candidates and link to elections
        const candidateData = [
            // Election 1 (Riverdale)
            { fullName: "Arjun Mehta", gender: "MALE", age: 42, party: "People First Collective", mobileNumber: "1234567891", election: elections[0]._id, image: "https://via.placeholder.com/150?text=Arjun", motto: "Progress Through Participation", address: { village: "Riverdale" } },
            { fullName: "Sara Lee", gender: "FEMALE", age: 38, party: "Unity Bloc", mobileNumber: "1234567892", election: elections[0]._id, image: "https://via.placeholder.com/150?text=Sara", motto: "Together We Grow", address: { village: "Riverdale" } },
            { fullName: "Ken Wong", gender: "MALE", age: 45, party: "Progressive Union", mobileNumber: "1234567893", election: elections[0]._id, image: "https://via.placeholder.com/150?text=Ken", motto: "Innovation for All", address: { village: "Riverdale" } },
            // Election 2 (Greenfield)
            { fullName: "Priya Das", gender: "FEMALE", age: 36, party: "Future Forward", mobileNumber: "8765432101", election: elections[1]._id, image: "https://via.placeholder.com/150?text=Priya", motto: "Building Tomorrow", address: { village: "Greenfield" } },
            { fullName: "Amit Patel", gender: "MALE", age: 50, party: "Green Citizens", mobileNumber: "8765432102", election: elections[1]._id, image: "https://via.placeholder.com/150?text=Amit", motto: "Sustainable Progress", address: { village: "Greenfield" } },
            { fullName: "Lisa Ray", gender: "FEMALE", age: 40, party: "Independent Alliance", mobileNumber: "8765432103", election: elections[1]._id, image: "https://via.placeholder.com/150?text=Lisa", motto: "Voice of the People", address: { village: "Greenfield" } },
        ];

        const candidates = [];
        for (let c of candidateData) {
            const result = await CandidateModel.findOneAndUpdate(
                { fullName: c.fullName, election: c.election },
                c,
                { upsert: true, new: true }
            );
            candidates.push(result);
        }
        console.log("✅ Candidates seeded (6 total)");

        // 4. Update elections to include candidate references
        for (let i = 0; i < elections.length; i++) {
            const electionCandidates = candidates.filter(c => c.election.toString() === elections[i]._id.toString());
            const candidateIds = electionCandidates.map(c => c._id);

            await ElectionModel.findByIdAndUpdate(
                elections[i]._id,
                { candidates: candidateIds },
                { new: true }
            );
        }
        console.log("✅ Candidate-election relationships linked");

        // 5. Verify seeded data
        const electionCount = await ElectionModel.countDocuments();
        const candidateCount = await CandidateModel.countDocuments();
        const voterCount = await VoterModel.countDocuments();
        const voteCount = await mongoose.connection.collection("votes").countDocuments({});

        console.log("\n========================================");
        console.log("ELECTOR TEST DATA SEEDED SUCCESSFULLY");
        console.log("========================================");
        console.log(`Elections:     ${electionCount}`);
        console.log(`Candidates:    ${candidateCount}`);
        console.log(`Test Voters:   ${voterCount}`);
        console.log(`Votes Created: ${voteCount}`);
        console.log("========================================");
        console.log("\nTest Voter Credentials:");
        console.log("Password: Test@12345");
        console.log("\nEmails:");
        voters.forEach((v, i) => console.log(`  ${i + 1}. ${v.email}`));
        console.log("========================================");

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error("❌ Seed Error:", err.message);
        await mongoose.disconnect().catch(() => {});
        process.exit(1);
    }
};

seedData();
