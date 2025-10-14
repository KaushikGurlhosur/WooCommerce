import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    woo_id: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    stock_status: {
      type: String,
      required: true,
      enum: ["instock", "outofstock", "onbackorder"],
      default: "instock",
    },
    stock_quantity: {
      type: Number,
      default: null,
      min: 0,
    },
    category: {
      type: String,
      default: "Uncategorized",
      trim: true,
      maxlength: 255,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    on_sale: {
      type: Boolean,
      default: false,
    },
    created_at: {
      type: Date,
      required: true,
    },
    ingested_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productSchema);
