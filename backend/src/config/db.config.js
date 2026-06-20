import mongoose from "mongoose";
import { MONGO_URI } from "./env.config";
import dns from "dns";

// Setting custom DNS servers to avoid potential DNS resolution issues with MongoDB Atlas
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    // Keep database startup explicit so server boot fails loudly on connection errors.
    await mongoose.connect(MONGO_URI);
    console.log("mongodb connected ....");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
