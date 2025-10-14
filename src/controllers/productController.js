import Products from "../models/Products.js";
import { fetchAllProducts, storeProducts } from "../scripts/ingestProducts.js";

// Fetching products from WooCommerce and storing in MongoDB
export const ingestProductController = async (req, res, next) => {
  try {
    const products = await fetchAllProducts;
    const result = await storeProducts(products);

    const totalCount = await Products.countDocuments();

    res.status(200).json({
      message: "Products ingested successfully",
      inserted: result.inserted,
      updated: result.updated,
      errors: result.errors,
      totalInDB: totalCount,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to ingest products",
      message: error.message,
    });
  }
};

// Get all products from MongoDB
export const getProductsController = async (req, res, next) => {
  try {
    const products = await Products.find().limit(100);
    res.status(200).json({
      total: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch products from DB",
      message: error.message,
    });
  }
};
