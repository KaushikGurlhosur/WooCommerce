import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/database.js";
import productRoutes from "./routes/productRoutes.js";
import segmentRoutes from "./routes/segmentRoutes.js";
import "./cron/cronJobs.js";
import helmet from "helmet";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";
import cors from "cors";

const app = express();

// CORS setup
app.use(cors({ origin: "https://woo-commerce-frontend-drab.vercel.app/" }));

dotenv.config();

app.use(express.json()); // for JSON parsing
app.use(helmet()); // for security headers

// Routes
app.use("/api", productRoutes);
app.use("/api", segmentRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("🚀 WooCommerce API Server is running!");
});

app.use(notFound);

// Global error handler
app.use(errorHandler);

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
