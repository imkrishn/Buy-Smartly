'use client';

import { setCartCount } from "@/redux/slices/cartCountSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { encryptEmail } from "@/utils/cipherText";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const secretKey = "immrcool@guyr-dfg4-fddf45d-ddcv2"

const random = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;


export default function Auth({ session }: any) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>()
  const [count, setCount] = useState<number>(0);
  const cartCount = useSelector((state: RootState) => state.cartCount);

  useEffect(() => {
    setCount(cartCount)
  }, [cartCount])


  useEffect(() => {
    async function fetchCartCount() {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/cartCount`, {
          withCredentials: true
        })

        if (res.data.success) {
          setCount(res.data.count)
          dispatch(setCartCount(res.data.count))
        }
      } catch (err) {
        console.log(err);

      }
    }

    fetchCartCount()
  }, [])

  function handleOnProfileClick() {
    const encryptedId = encryptEmail(session?.token?.email, process.env.CIPHER_SECRET! || secretKey);
    router.push(`/profile/${encryptedId}`)
  }

  return (

    <div>
      {!session.status && (
        <select
          className="bg-transparent text-2xl cursor-pointer px-4 py-2 rounded"
        >
          <option onClick={() => router.push("/auth/login")}>Login</option>
          <option onClick={() => router.push("/auth/signup")}>Signup</option>
        </select>
      )}
      {session.status && session && (
        <div className="flex gap-3">
          <div className="relative py-5 px-3 flex gap-2">
            <div onClick={() => router.push(`/myOrders/${random}`)} className="border border-blue-500 cursor-pointer active:scale-95 rounded-2xl px-2 py-1 font-sans select-none">Orders</div>
            <svg
              onClick={() => router.push(`/cart/${random}`)}
              className="h-7 cursor-pointer active:scale-95"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
            >
              <path
                fill="#e01b24"
                d="M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"
              />
            </svg>
            {count > 0 && <p className="absolute right-0 top-0 w-5 text-sm text-center bg-blue-900 rounded-full text-white font-extrabold">
              {count}
            </p>}
          </div>
          <div
            className="w-14 h-14 border flex items-center justify-center text-4xl font-extrabold rounded-full  cursor-pointer active:scale-95 select-none"
            onClick={handleOnProfileClick}
          >
            {session?.token?.picture ? (
              <Image
                src={session.token.picture}
                alt="user"
                width={100}
                height={100}
                className="rounded-full bg-cover"
              />
            ) : (
              session?.token?.fullName[0].toUpperCase()
            )}
          </div>
        </div>
      )}
    </div>

  );
}
