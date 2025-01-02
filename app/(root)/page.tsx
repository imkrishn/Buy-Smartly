"use client"

import Footer from "@/components/Footer";
import HeroSlider from "@/components/HeroSlider";
import ProductCard from "@/components/ProductCard";
import axios from "axios";
import { useEffect, useState } from "react";




export default function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
        if (res.status === 200) {
          setProducts(res.data)
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, [])

  return (
    isLoading ? (
      <div className="w-full h-screen">
        <div className="spinner m-auto"></div>
      </div>
    ) : (
      <main className="w-full h-full overflow-y-auto">
        <HeroSlider />
        <div className="w-full lg:px-60 flex flex-wrap gap-7 py-7">
          {products.map((product: any) => (
            <ProductCard
              key={product._id}
              description={false}
              data={product}
              price={true}
              cartBtn={true}
              rating={true}
            />
          ))}
        </div>
        <Footer />
      </main>
    )
  );
}
