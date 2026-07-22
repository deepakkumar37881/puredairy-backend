import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "node:dns";

console.log("DATABASE.JS LOADED");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

dotenv.config();

const connectDB = async () => {
  try {
    console.log("Mongo URI:", process.env.MONGODB_URI);

    mongoose.set("debug", true);

    console.log("Connecting with:", process.env.MONGODB_URI);

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("✅ MongoDB Connected:", conn.connection.host);
  } catch (err) {
    console.error("========== MONGODB ERROR ==========");
    console.error("Name:", err.name);
    console.error("Message:", err.message);
    console.error("Reason:", err.reason);

    if (err.reason?.servers) {
      for (const [host, server] of err.reason.servers) {
        console.log("\nHost:", host);
        console.log(server);
      }
    }

    process.exit(1);
  }
};

export default connectDB;