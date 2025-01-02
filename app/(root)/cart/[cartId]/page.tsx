'use client'

import ProductCartCard from "@/components/ProductCartCard";
import Summary from "@/components/Summary";
import { Button } from "@/components/ui/button";
import { setCartCount } from "@/redux/slices/cartCountSlice";
import { AppDispatch } from "@/redux/store";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

interface Product {
  _id: string,
  productName: string,
  productDescription: string,
  productRating: number,
  productTotalPrice: number,
  productSalePrice: number,
  quantity: number,
  productImages: [{ url: string }]
}

const random = `${Date.now().toString(16)}-${Math.random().toString(16).substr(2, 4)}-4000-8000-${Math.random().toString(16).substr(2, 12)}`;


export default function Cart() {
  const router = useRouter();
  const [data, setData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [, setTotalamount] = useState<number>(0);
  const dispatch = useDispatch<AppDispatch>()

  async function handleRemoveItem(itemId: string, quantity: string) {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/removeCart`, {
        withCredentials: true,
        headers: {
          itemId: itemId,
          quantity: quantity
        }
      });

      if (res.data.success && Number(quantity) <= 0) {
        const products = data.filter((item: Product) => item._id !== itemId)
        const count = products.reduce((acc: number, item: any) => acc + item.quantity, 0)
        setData(products)
        dispatch(setCartCount(count))
      } else {
        setData(data.map((item: Product) =>
          item._id === itemId
            ? { ...item, quantity: res.data.quantity }
            : item
        ));
      }
    } catch (err) {
      console.log(err);

    }
  }

  useEffect(() => {
    const getCart = async () => {
      try {
        setIsLoading(true)
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/getCart`, {
          withCredentials: true
        });
        if (res.data && res.data.data) {
          setData(res.data.data);
        } else {
          setData([]);
        }
      } catch (err) {
        console.log("Error fetching cart:", err);
        setData([]);
      } finally {
        setIsLoading(false)
      }
    };

    getCart();
  }, []);



  return (

    <div className="w-full lg:h-screen lg:px-60 flex overflow-hidden lg:gap-7 items-center justify-center">
      {data.length > 0 ? (
        <>
          {isLoading ? (
            <div className="spinner" aria-live="polite">Loading...</div>
          ) : (
            <>
              <div className="overflow-y-auto lg:h-[25rem] h-[35rem] flex flex-col gap-3 py-3">
                {data?.map((item: Product) => (
                  <ProductCartCard
                    key={item._id}
                    cartItem={item}
                    handleRemoveItem={handleRemoveItem}
                  />
                ))}
              </div>
              <div>
                <Summary data={data} setAmount={setTotalamount} />
                <Button variant={'checkout'} onClick={() => router.push(`/order/${random}`)} className="my-2 w-full">
                  Checkout Now
                </Button>
              </div>
            </>
          )}
        </>
      ) : (
        <div>Your Cart is Empty</div>
      )}
    </div>
  )
}
