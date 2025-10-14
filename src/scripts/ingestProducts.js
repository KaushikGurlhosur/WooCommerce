import axios from "axios";
import dotenv from "dotenv";
import Products from "../models/Products.js";

dotenv.config();

const WOOCOMMERCE_CONFIG = {
  baseURL: process.env.WOOCOMMERCE_BASE_URL?.replace(/\/$/, ""), // remove trailing slash if present
  auth: {
    username: process.env.WOOCOMMERCE_CONSUMER_KEY,
    password: process.env.WOOCOMMERCE_CONSUMER_SECRET,
  },
};

export async function fetchAllProducts() {
  let allProducts = [];
  let page = 1;
  const perPage = 100;

  try {
    console.log("🔄 Starting product ingestion from WooCommerce...");

    while (true) {
      const url = `${WOOCOMMERCE_CONFIG.baseURL}/products`;
      console.log(`🌐 Fetching page ${page}: ${url}`);

      const response = await axios.get(url, {
        auth: WOOCOMMERCE_CONFIG.auth,
        params: { per_page: perPage, page },
        timeout: 30000,
        validateStatus: (status) => status < 500, // don't throw for 404, handle manually
      });

      if (response.status === 401) {
        throw new Error("❌ Unauthorized – Check your WooCommerce API keys");
      }

      if (response.status === 404) {
        throw new Error("❌ Not Found – Check your base URL or API endpoint");
      }

      if (response.data.length === 0) {
        console.log("⚠️ No more products found.");
        break;
      }

      allProducts = allProducts.concat(response.data);
      console.log(`📥 Fetched page ${page}: ${response.data.length} products`);

      page++;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    console.log(`✅ Successfully fetched ${allProducts.length} products total`);
    return allProducts;
  } catch (error) {
    console.error("💥 Error fetching products:");
    console.error(`   Message: ${error.message}`);
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   URL: ${error.config?.url}`);
      console.error(
        `   Response: ${JSON.stringify(error.response.data, null, 2)}`
      );
    }
    throw error;
  }
}

export async function storeProducts(products) {
  try {
    let inserted = 0;
    let updated = 0;
    let errors = 0;

    for (const product of products) {
      try {
        const productData = {
          woo_id: product.id,
          title: product.name,
          price: parseFloat(product.price) || 0,
          stock_status: product.stock_status,
          stock_quantity: product.stock_quantity,
          category: product.categories?.[0]?.name || "Uncategorized",
          tags: product.tags?.map((tag) => tag.name) || [],
          on_sale: product.on_sale || false,
          created_at: new Date(product.date_created),
        };

        // Use findOneAndUpdate with upsert for atomic operations
        const result = await Products.findOneAndUpdate(
          { woo_id: product.id },
          productData,
          {
            upsert: true,
            new: true,
            runValidators: true,
          }
        );

        if (result.isNew) {
          inserted++;
        } else {
          updated++;
        }
      } catch (error) {
        console.error(
          `❌ Failed to store product ${product.id}:`,
          error.message
        );
        errors++;
      }
    }

    console.log(`💾 Mongoose Results:`);
    console.log(`   ✅ Inserted: ${inserted}`);
    console.log(`   🔄 Updated: ${updated}`);
    console.log(`   ❌ Errors: ${errors}`);

    return { inserted, updated, errors };
  } catch (error) {
    console.error("❌ Mongoose storage error:", error);
    throw error;
  }
}
