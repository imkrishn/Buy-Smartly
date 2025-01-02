'use client';

import React, { useState } from "react";
import axios from "axios";

const ProductUpload: React.FC = () => {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productRating, setProductRating] = useState(0);
  const [productTotalPrice, setProductTotalPrice] = useState(0);
  const [productSalePrice, setProductSalePrice] = useState(0);
  const [productCategory, setProductCategory] = useState("");
  const [productImages, setProductImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProductImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("productName", productName);
      formData.append("productDescription", productDescription);
      formData.append("productRating", productRating.toString());
      formData.append("productTotalPrice", productTotalPrice.toString());
      formData.append("productSalePrice", productSalePrice.toString());
      formData.append("productCategory", productCategory);

      productImages.forEach((file) => formData.append("productImages", file));

      const response = await axios.post("/api/admin/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload Successful:", response.data);
      // Reset form
      setProductName("");
      setProductDescription("");
      setProductRating(0);
      setProductTotalPrice(0);
      setProductSalePrice(0);
      setProductCategory("");
      setProductImages([]);
    } catch (err: any) {
      console.error("Upload failed:", err);
      setError(err.response?.data?.message || "An unexpected error occurred.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="productUpload w-full h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-6">Upload Product</h1>
      <form
        className="flex flex-col gap-5 border rounded-lg p-6 w-full max-w-lg bg-white shadow-md"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="px-4 py-2 outline-none border rounded-lg"
          required
        />
        <textarea
          placeholder="Product Description"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          className="px-4 py-2 outline-none border rounded-lg"
          required
        />
        <input
          type="number"
          placeholder="Rating"
          value={productRating}
          onChange={(e) => setProductRating(parseFloat(e.target.value))}
          className="px-4 py-2 outline-none border rounded-lg"
          min={0}
          max={5}
          step={0.1}
          required
        />
        <input
          type="number"
          placeholder="Total Price"
          value={productTotalPrice}
          onChange={(e) => setProductTotalPrice(parseFloat(e.target.value))}
          className="px-4 py-2 outline-none border rounded-lg"
          min={0}
          required
        />
        <input
          type="number"
          placeholder="Sale Price"
          value={productSalePrice}
          onChange={(e) => setProductSalePrice(parseFloat(e.target.value))}
          className="px-4 py-2 outline-none border rounded-lg"
          min={0}
          required
        />
        <div>
          <label className="text-gray-600">Category:</label>
          {["Men", "Women", "Kids", "Other"].map((category) => (
            <label key={category} className="ml-4">
              <input
                type="radio"
                name="category"
                value={category}
                checked={productCategory === category}
                onChange={(e) => setProductCategory(e.target.value)}
                required
              />
              {category}
            </label>
          ))}
        </div>
        <input
          type="file"
          onChange={handleFileChange}
          className="px-4 py-2 outline-none border rounded-lg"
          multiple
          required
        />
        <button
          type="submit"
          disabled={uploading}
          className="px-4 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600 active:scale-95 disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default ProductUpload;
