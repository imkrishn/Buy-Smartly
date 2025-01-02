'use client'

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import logo from "@/app/favicon.ico"

export default function Navbar() {
  const [search, setSearch] = useState("")
  const router = useRouter();

  const handleCategoryClick = (category: string) => {
    if (category === "Men" || category === "Women" || category === "Kids") {
      return router.push(`/category/${category}`)
    }
    if (category === "Home") {
      return router.push("/")
    }
    if (category === "About") {
      return router.push("/about")
    }
  };

  return (
    <div className="flex gap-2 w-full  items-center justify center">
      <Image src={logo} alt="#" className="lg:h-16 h-11 lg:w-48 w-44" priority />
      <div className="flex bg-white rounded items-center border w-full">
        <input
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Your wishes"
          className="px-2 w-full py-1 rounded outline-none"
          onSubmit={() => router.push(`/category/${search}`)}
        />
        <svg onClick={() => router.push(`/category/${search}`)} className="h-5 p-1 cursor-pointer active:scale-95" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" /></svg>
      </div>
      <div className="flex justify-center items-center lg:flex-row flex-col lg:gap-3 gap-1  font-bold ">
        {["Home", "Men", "Women", "Kids", "About"].map((item, index) => (
          <div key={index} onClick={() => handleCategoryClick(item)} className="cursor-pointer active:scale-95  active:text-blue-600 select-none">{item}</div>
        ))}
      </div>
    </div>
  )
}