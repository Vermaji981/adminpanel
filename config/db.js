
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/deshboardadminpanel";
    console.log(`Connecting to MongoDB at: ${connStr}...`);

    await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 3000
    });

    console.log("MongoDB Connected Successfully to Local Database!");
    await autoSeedAdmin();

  } catch (error) {
    console.log("Local MongoDB service not reachable:", error.message);
    console.log("Starting automatic In-Memory MongoDB Fallback Server...");

    try {
      const { MongoMemoryServer } = require("mongodb-memory-server");
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();

      await mongoose.connect(mongoUri);
      console.log(`Fallback In-Memory MongoDB Connected at: ${mongoUri}`);

      await autoSeedAdmin();
    } catch (memError) {
      console.error("Failed to start Fallback MongoDB:", memError.message);
    }
  }
};

const autoSeedAdmin = async () => {
  try {
    const User = require("../models/User");
    const bcrypt = require("bcryptjs");

    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await User.create({
        name: "Default Admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        role: "admin"
      });
      console.log("Auto-seeded default Admin Account: admin@gmail.com / admin123");
    }
  } catch (err) {
    console.log("Auto-seed error:", err.message);
  }
};

module.exports = connectDB;