import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/database.js";

const app = express();

dotenv.config();

(async () => {
  try {
    await connectDB();
    console.log("Database connected successfully.");

    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("💥 Failed to start server:", error);
    process.exit(1);
  }
})();
