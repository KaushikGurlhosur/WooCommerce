import express from "express";
import {
  getProductsController,
  ingestProductController,
} from "../controllers/productController.js";

const router = express.Router();

// Ingest products from WooCommerce API
router.post("/ingest", ingestProductController);

// Get all products
router.get("/products", getProductsController);

export default router;
