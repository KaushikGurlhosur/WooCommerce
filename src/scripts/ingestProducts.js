// import axios from "axios";
// // import Product from "../models/Product.js";
// import dotenv from "dotenv";

// dotenv.config();

// const WOOCOMMERCE_CONFIG = {
//   baseURL: process.env.WOOCOMMERCE_BASE_URL,
//   auth: {
//     username: process.env.WOOCOMMERCE_CONSUMER_KEY,
//     password: process.env.WOOCOMMERCE_CONSUMER_SECRET,
//   },
// };

// export async function fetchAllProducts() {
//   let allProducts = [];
//   let page = 1;
//   const perPage = 100;

//   try {
//     console.log("🔄 Starting product ingestion from WooCommerce...");

//     while (true) {
//       const response = await axios.get("products", {
//         baseURL: WOOCOMMERCE_CONFIG.baseURL,
//         auth: WOOCOMMERCE_CONFIG.auth,
//         params: {
//           per_page: perPage,
//           page: page,
//         },
//         timeout: 30000,
//       });

//       if (response.data.length === 0) {
//         break;
//       }

//       allProducts = allProducts.concat(response.data);
//       console.log(`📥 Fetched page ${page}: ${response.data.length} products`);

//       page++;
//       await new Promise((resolve) => setTimeout(resolve, 100));
//     }

//     console.log(`✅ Successfully fetched ${allProducts.length} products total`);
//     return allProducts;
//   } catch (error) {
//     console.error("❌ Error fetching products:", error.message);
//     throw error;
//   }
// }

import axios from "axios";
import dotenv from "dotenv";

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
