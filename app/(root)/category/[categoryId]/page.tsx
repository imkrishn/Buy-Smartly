import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import axios from "axios";

interface Product {
  _id: string,
  productName: string,
  productDescription: string,
  productRating: number,
  productTotalPrice: number,
  productSalePrice: number
  productImages: { url: string }[]
}

async function fetchProducts(categoryId: string): Promise<Product[]> {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/category`, {
      params: { categoryId },
    });

    if (!Array.isArray(res.data.products)) {
      throw new Error("Invalid API response: products is not an array");
    }

    return res.data.products;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  } finally {
    console.log("done");

  }
}

export default async function CategoryPage({
  params,
}: {
  params: any;
}) {

  const { categoryId } = await params;



  if (!categoryId) {
    return <div>Error: Category ID is missing</div>;
  }


  const products = await fetchProducts(categoryId);


  return (
    <div className="">
      <div className="w-full  flex lg:px-60 flex-wrap gap-7 py-3">
        <div className="flex justify-end items-end w-full">
          <svg className="h-11  cursor-pointer active:scale-95 my-2 border rounded lg:mr-7   p-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path fill="#77767b" d="M3.9 54.9C10.5 40.9 24.5 32 40 32l432 0c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9 320 448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6l0-79.1L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z" />
          </svg>
        </div>
        {products.length > 0 ? (
          products.map((product: any) => (
            <ProductCard key={product._id} description={true} data={product} price={true} cartBtn={false} rating={true} />
          ))
        ) : (
          <p className="text-center w-full text-gray-500">No products available in this category.</p>
        )}
      </div>
      <Footer />
    </div>
  );
}
