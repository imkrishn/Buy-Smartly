'use client'

import Address from "@/components/Address";
import Payment from "@/components/Payment";
import ProductOrderCard from "@/components/ProductOrderCard";
import Summary from "@/components/Summary";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import convertToSubcurrency from "@/lib/convertToSubCurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { clearOrder, setOrder } from "@/redux/slices/orderSlice";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

interface Product {
  _id: string;
  productName: string;
  productDescription: string;
  productRating: number;
  productTotalPrice: number;
  productSalePrice: number;
  productImages: any;
  quantity: number;
}

interface OrderItems {
  productId: string;
  quantity: number;
  price: number;
}

interface Order {
  address: string;
  orderItems: OrderItems[];
  totalAmount: number;
}

export default function Order() {
  const [orderData, setOrderData] = useState<Product[]>([]);
  const [cart, setCart] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(0.5);
  const [address, setAddress] = useState<string>("");
  const [orderDetails, setOrderDetails] = useState<Order>({
    address: "",
    totalAmount: 0,
    orderItems: [],
  });
  const [orderItems, setOrderItems] = useState<OrderItems[]>([]);

  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const slug = params.orderId;

  // Clear order on mount
  useEffect(() => {
    dispatch(clearOrder());
  }, [dispatch]);

  // Fetch cart or product data
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setIsLoading(true);

        if (slug && slug.length === 24) {
          // Fetch single product
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/item`, {
            params: { productId: slug },
          });

          if (res.data?.success) {
            const item = res.data.item;
            setOrderData([{ ...item, quantity: 1 }]);
            setOrderItems([
              {
                productId: item._id,
                price: item.productSalePrice * 1.18 || 0,
                quantity: 1,
              },
            ]);
            setCart(false);
          } else {
            throw new Error("Failed to fetch product data");
          }
        } else {
          // Fetch cart
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/getCart`, {
            withCredentials: true,
          });

          if (res.data?.success) {
            const cartItems = res.data.data;
            setOrderData(cartItems);
            setOrderItems(
              cartItems.map((item: any) => ({
                productId: item._id,
                price: item.productSalePrice * 1.18 || 0,
                quantity: item.quantity || 0,
              }))
            );
            setCart(true);
          } else {
            throw new Error("Failed to fetch cart data");
          }
        }
      } catch (error) {
        console.error("Error fetching order data:", error);
        setOrderData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderData();
  }, [slug]);

  // Update order details
  useEffect(() => {
    const updatedOrderDetails = {
      totalAmount: amount,
      address: address,
      orderItems: orderItems,
    };
    setOrderDetails(updatedOrderDetails);
    dispatch(setOrder(updatedOrderDetails));
  }, [amount, address, orderItems, dispatch]);

  return (
    <div className="lg:px-60 w-full py-5">
      {isLoading ? (
        <div className="spinner m-auto"></div>
      ) : (
        <>
          {cart ? (
            <div className="product w-full shadow-lg my-3 flex overflow-auto p-3 gap-3">
              {orderData.map((item: any) => (
                <ProductOrderCard data={item} key={item._id} />
              ))}
            </div>
          ) : (
            <div className="product w-full shadow-lg my-3 flex overflow-auto">
              {orderData[0]?.productImages[0]?.url && (
                <ProductCard
                  key={orderData[0]?._id}
                  data={orderData[0]}
                  price={true}
                  cartBtn={false}
                  rating={false}
                  description={false}
                />
              )}
              <div className="m-auto lg:w-1/2 w-full">
                <h1 className="text-3xl font-extrabold">Speciality</h1>
                <div className="text-2xl font-extralight">{orderData[0]?.productDescription}</div>
              </div>
            </div>
          )}
        </>
      )}

      {isLoading ? (
        <div className="spinner m-auto"></div>
      ) : (
        <div className="w-full my-3 lg:flex">
          <Summary data={orderData} setAmount={setAmount} />
          <Address handleAddress={setAddress} />
        </div>
      )}

      <Elements
        stripe={stripePromise}
        options={{
          mode: "payment",
          amount: convertToSubcurrency(amount),
          currency: "usd",
        }}
      >
        <Payment amount={amount} orderDetail={orderDetails} />
      </Elements>
    </div>
  );
}
