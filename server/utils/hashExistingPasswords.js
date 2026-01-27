const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const VoterModel = require("../model/voterModel.js");

async function hashExistingPasswords() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");

    const voters = await VoterModel.find({}).select("+password");

    for (const voter of voters) {
      // Check if password is already hashed
      if (
        !voter.password.startsWith("$2a$") &&
        !voter.password.startsWith("$2b$") &&
        !voter.password.startsWith("$2y$")
      ) {
        console.log(`Hashing password for user: ${voter.email}`);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(voter.password, salt);
        voter.password = hashedPassword;
        await voter.save();
        console.log(`Password hashed for user: ${voter.email}`);
      } else {
        console.log(`Password already hashed for user: ${voter.email}`);
      }
    }

    console.log("All passwords checked and hashed if necessary.");
  } catch (error) {
    console.error("Error hashing passwords:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}
