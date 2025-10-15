import { connectDB } from "../config/database.js";
import cron from "node-cron";
import { fetchAllProducts, storeProducts } from "../scripts/ingestProducts.js";
(async () => {
  try {
    await connectDB();
    console.log("✅ Database connected successfully for cron jobs.");

    // Cron job to run every 6 hours
    cron.schedule("0 */6 * * *", async () => {
      console.log("⏰ Cron Job Triggered: Starting WooCommerce ingestion...");
      try {
        const products = await fetchAllProducts();
        const result = await storeProducts(products);
        console.log("✅ Cron Job Completed:", result);
      } catch (error) {
        console.error("💥 Cron Job Failed:", error.message);
      }
    });
    console.log("🕒 Cron job scheduled: will run every 6 hours.");
  } catch (error) {
    console.error("❌ Failed to initialize cron jobs:", error.message);
    process.exit(1);
  }
})();
