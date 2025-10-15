import Products from "../models/Products.js";
import { fetchAllProducts, storeProducts } from "../scripts/ingestProducts.js";

// Fetching products from WooCommerce and storing in MongoDB
export const ingestProductController = async (req, res, next) => {
  try {
    const products = await fetchAllProducts();
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    const skip = (page - 1) * limit;

    const [products, totalProducts] = await Promise.all([
      Products.find({}).skip(skip).limit(limit).sort({ created_at: -1 }),
      Products.countDocuments({}),
    ]);
    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({
      products,
      currentPage: page,
      totalPages: totalPages,
      totalProducts: totalProducts,
      limit,
    });
  } catch (error) {
    console.error("Failed to fetch products from DB:", error);
    res.status(500).json({
      error: "Failed to fetch products from DB",
      message: error.message,
    });
  }
};
