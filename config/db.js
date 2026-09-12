
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
mongoose.set("bufferCommands", false);

let connectionPromise;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not configured");
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000
    }).then(async () => {
      console.log("MongoDB Atlas connected successfully");
      await autoSeedAdmin();
    }).catch((error) => {
      connectionPromise = undefined;
      console.error("MongoDB Atlas connection failed:", error.message);
      throw error;
    });
  }

  await connectionPromise;
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