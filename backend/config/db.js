import mongoose from "mongoose";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

const MAX_RETRIES = 5;
const BASE_DELAY = 2000; // 2 seconds

const connectDB = async (retryCount = 0) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "test"
    });

    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error(`❌ MongoDB connection failed (attempt ${retryCount + 1})`);
    console.error(error.message);

    if (retryCount >= MAX_RETRIES) {
      console.error("💀 Max retries reached. Exiting process.");
      process.exit(1);
    }

    const delay = BASE_DELAY * Math.pow(2, retryCount);
    console.log(`🔁 Retrying in ${delay / 1000}s...`);

    setTimeout(() => connectDB(retryCount + 1), delay);
  }
};

export default connectDB;