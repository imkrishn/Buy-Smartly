'use client'

import Filter from "@/components/Filter";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // Correct import for Next 13+ App Router

interface Product {
  _id: string;
  productName: string;
  productDescription: string;
  productRating: number;
  productTotalPrice: number;
  productSalePrice: number;
  productImages: { url: string }[];
}

export default function CategoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { categoryId } = useParams();

  useEffect(() => {
    async function fetchProducts(categoryId: string) {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/category`, {
          params: { categoryId },
        });

        if (!Array.isArray(res.data.products)) {
          throw new Error("Invalid API response: products is not an array");
        }

        setProducts(res.data.products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }

    if (categoryId) {
      fetchProducts(categoryId as any);  // Ensure categoryId is a string
    }
  }, [categoryId]);

  if (!categoryId) {
    return <div>Error: Category ID is missing</div>;
  }

  return (
    <div>
      <div className="w-full flex lg:px-60 flex-wrap gap-7 py-3 lg:min-h-96">
        <Filter setProducts={setProducts} />
        {isLoading ? (
          <p className="spinner m-auto"></p>
        ) : products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product._id}
              description={true}
              data={product}
              price={true}
              cartBtn={false}
              rating={true}
            />
          ))
        ) : (
          <p className="text-center w-full text-gray-500">No products available in this category.</p>
        )}
      </div>
      <Footer />
    </div>
  );
}
