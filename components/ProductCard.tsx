'use client'

import Image from "next/image";
import CartBtn from "./CartBtn";
import { useRouter } from "next/navigation";


interface Product {
  _id: string,
  productName: string,
  productDescription: string,
  productRating: number,
  productTotalPrice: number,
  productSalePrice: number
  productImages: { url: string }[]
}

interface ProductCardProps {
  description: boolean
  price: boolean
  cartBtn: boolean
  rating: boolean
  data: Product

}



export default function ProductCard({ description, price, data, cartBtn, rating }: ProductCardProps) {
  const router = useRouter()

  const image = data?.productImages[1]?.url || data?.productImages[0]?.url;

  return (
    <div key={data?._id} className="relative w-48 rounded-lg p-3 shadow-lg flex flex-col gap-2 ">
      <Image src={image} onClick={() => router.push(`/products/${data?._id}`)} height={100} width={100} alt="#" className="m-auto cursor-pointer active:scale-95" />
      <div className="text-2xl font-bold">{data?.productName}</div>
      {description && <div className="w-full flex">
        <div className="h-6 w-[97%] overflow-hidden">{data?.productDescription}</div>
        <div>...</div>
      </div>}
      {rating && <div className="absolute top-1 left-2 rounded-lg p-1 text-white font-bold bg-blue-500">{data?.productRating} ⭐ </div>}
      {price && <div className="flex items-center gap-2">
        <div className="font-bold">${data?.productSalePrice}</div>
        <div className="line-through text-2xl">${data?.productTotalPrice}</div>
      </div>}
      {cartBtn && <CartBtn productId={data?._id} />}
    </div>
  )
}