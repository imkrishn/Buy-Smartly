'use client'

import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";

export default function MyOrders() {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleOnCancel(orderId: string, status: string) {

    if (status === "cancelled") {
      return alert("It already been cancelled.")
    }

    const isConfirm = window.confirm("Are you sure to cancel the order");

    if (!isConfirm) {
      return
    }

    try {

      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/orderCancel`, {
        withCredentials: true,
        orderId
      })

      if (res.data.success) {
        window.location.reload()
      }
    } catch (err) {
      console.log(err);

    }
  }

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true)
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/myOrders`, {
          withCredentials: true,
        });


        // Update state with fetched order data
        if (res.data.success) {
          setData(res.data.orders); // Assuming response structure contains orders
        } else {
          // Handle case when no orders are found or failure in response
          console.error('Failed to fetch orders:', res.data.message);
        }

      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false)
      }
    }

    fetchOrders();
  }, []);

  return (
    <div className="w-full h-screen lg:px-60 py-3 font-work-sans">
      <h1 className="text-4xl font-extrabold m-auto w-max">Your Orders</h1>
      {loading ? (<div className="spinner m-auto"></div>) : (
        <div className="rounded p-2">
          {/* Check if there are orders to display */}
          {data.length > 0 ? (

            data.map((order: any, orderIndex: number) => (
              <div key={orderIndex} className="mb-4 flex lg:flex-row flex-col border p-3 rounded items-center justify-center">
                <div className="p-2">
                  <h3 className={` mb-2 border text-white w-max px-3 py-3 rounded ${order.status === "cancelled" ? "bg-red-600" : "bg-slate-500"}`}><strong>Status: </strong> {order.status}</h3>
                  <p className="text-md mb-2"><strong>Address: </strong>{order.address}</p>
                  <p className="text-2xl"><strong>Total Amount: </strong>${order.totalAmount}</p>
                  <div className="m-auto font-semibold  w-max px-3 py-2 rounded my-2">Product get Arrive to you by {new Intl.DateTimeFormat('en-GB', {
                    day: 'numeric',
                    month: 'long',
                  }).format(new Date(new Date(order.createdAt).getTime() + + 3 * 24 * 60 * 60 * 1000))}
                  </div>
                  <Button onClick={() => handleOnCancel(order._id, order.status)} variant={'link'} className="w-full border">Cancel</Button>
                </div>
                <div className="lg:w-1/2 flex overflow-x-auto items-center justify-center shadow-lg">
                  {/* Displaying order items */}
                  {order.orderItems.map((product: any, productIndex: number) => (
                    <ProductCard
                      key={productIndex}
                      data={product.product}
                      rating={false}
                      description={false}
                      cartBtn={false}
                      price={false}
                    />
                  ))}
                </div>

              </div>
            ))
          ) : (
            <p>No orders found.</p>
          )}
        </div>)}
    </div>
  );
}
