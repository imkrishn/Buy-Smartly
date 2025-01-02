'use client'

import ProductCard from "./ProductCard";
import { Button } from "./ui/button";
import { useState } from "react";



interface ProductCart {
  _id: string,
  productName: string,
  productDescription: string,
  productRating: number,
  productTotalPrice: number,
  productSalePrice: number,
  quantity: number,
  productImages: [{ url: string }]
}




export default function ProductCartCard({ cartItem, handleRemoveItem }: { cartItem: ProductCart, handleRemoveItem: (itemId: string, quantity: string) => void }) {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [limit, setLimit] = useState<string>("");

  async function handleUpdateQuantity(itemId: string, quantity: string) {
    await handleRemoveItem(itemId, quantity);
    setIsEdit(false)
  }

  return (
    <div className=" lg:flex shadow-lg py-3">
      <ProductCard data={cartItem} description={false} price={false} cartBtn={false} rating={true} />
      <div className="flex flex-col items-center justify-center gap-5 px-7">
        <span className="flex lg:flex-row flex-col items-center">
          <b>Quantity : </b>
          <input onChange={(e) => setLimit(e.target.value)} type="number" min={1} max={10} defaultValue={cartItem.quantity} step={1} className="max-w-max outline-none  px-2" disabled={!isEdit} />
          {!isEdit && <svg onClick={() => setIsEdit(true)} className="h-5 cursor-pointer active:scale-95" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z" /></svg>}
          {isEdit && <svg onClick={() => handleUpdateQuantity(cartItem._id, limit)} className="h-5 cursor-pointer active:scale-95" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="#26a269" d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" /></svg>}
        </span>

        <Button variant={'destructive'} onClick={() => handleRemoveItem(cartItem._id, "0")}>Remove</Button>
      </div>
    </div>
  )
}