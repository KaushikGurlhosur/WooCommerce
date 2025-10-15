import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/database.js";
import productRoutes from "./routes/productRoutes.js";
import segmentRoutes from "./routes/segmentRoutes.js";
import "./cron/cronJobs.js";

const app = express();

dotenv.config();

app.use(express.json()); // for JSON parsing

// Routes
app.use("/api", productRoutes);
app.use("/api", segmentRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("🚀 WooCommerce API Server is running!");
});

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
