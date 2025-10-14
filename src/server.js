import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/database.js";
import { fetchAllProducts, storeProducts } from "./scripts/ingestProducts.js";

const app = express();

dotenv.config();

app.use(express.json()); // for JSON parsing

// Routes
app.get("/", async (req, res) => {
  try {
    const products = await fetchAllProducts();
    const result = await storeProducts(products);
    res.json({
      message: "✅ Products fetched successfully",
      total: products.length,
      sample: products.slice(0, 3), // just first 3 to preview
    });
  } catch (error) {
    console.error("❌ Error in / route:", error.message);
    res.status(500).json({
      error: "Failed to fetch products",
      message: error.message,
      stack: error.stack,
    });
  }
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
