const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
require("dotenv").config();

const VoterModel = require("../model/voterModel");

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

const createAdmin = async () => {
  await connectDB();

  const adminEmail = process.env.ADMIN_EMAIL || "admin@election.gov";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123456";
  const adminName = process.env.ADMIN_NAME || "System Administrator";

  try {
    // Check if admin already exists
    const existingAdmin = await VoterModel.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("⚠️ Admin already exists");

      // Update existing admin to ensure isAdmin is true
      if (!existingAdmin.isAdmin) {
        existingAdmin.isAdmin = true;
        await existingAdmin.save();
        console.log("✅ Admin role updated");
      }
    } else {
      // Create new admin
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      const admin = await VoterModel.create({
        fullName: adminName,
        email: adminEmail.toLowerCase(),
        password: hashedPassword,
        mobile_number: 9999999999,
        isAdmin: true,
        profileImage: "",
        gender: "OTHER",
      });

      console.log("✅ Admin created successfully");
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
      console.log("   ⚠️ CHANGE THE PASSWORD AFTER FIRST LOGIN!");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
