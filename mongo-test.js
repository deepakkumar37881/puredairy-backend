import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

try {
  const conn = await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ Connected:", conn.connection.host);
} catch (err) {
  console.error(err);
}