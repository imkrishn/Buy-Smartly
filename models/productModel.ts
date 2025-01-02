import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  productDescription: { type: String, required: true },
  productRating: { type: Number, default: 0 },
  productTotalPrice: { type: Number, required: true },
  productSalePrice: { type: Number, required: true },
  productCategory: { type: String, required: true },
  productImages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }], // Reference to Image model
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
