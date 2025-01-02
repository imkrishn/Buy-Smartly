'use client'

import { useEffect, useState } from "react";

interface Product {
  _id: string,
  productName: string,
  productDescription: string,
  productRating: number,
  productTotalPrice: number,
  productSalePrice: number,
  quantity: number,
  productImages: { url: string }[]
}

export default function Summary({ data, setAmount }: { data: Product[], setAmount: (totalAmount: number) => void }) {

  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [salePrice, setSalePrice] = useState<number>(0)
  const [discount, setDiscount] = useState<number>(0);
  const [gst, setGst] = useState<number>(0);
  const [shipping, setShipping] = useState<number>(0)
  const [total, setTotal] = useState<number>(0)


  useEffect(() => {
    if (data.length > 0) {
      const calculatedTotalPrice = data.reduce(
        (acc, item) => acc + (item.productTotalPrice * item.quantity),
        0
      );
      const calculatedSalePrice = data.reduce(
        (acc, item) => acc + (item.productSalePrice * item.quantity),
        0
      );
      setTotalPrice(calculatedTotalPrice);
      setSalePrice(calculatedSalePrice);

      const calculatedDiscount =
        calculatedTotalPrice > 0
          ? 100 - ((calculatedSalePrice * 100) / calculatedTotalPrice)
          : 0;
      setDiscount(calculatedDiscount);
      setGst(calculatedSalePrice * 0.18)
      const calculatedShipping = calculatedSalePrice < 1000 ? 5 : 0;
      setShipping(calculatedShipping);


      const calculatedTotal = calculatedSalePrice + calculatedSalePrice * 0.18 + calculatedShipping;
      setTotal(calculatedTotal);
      setAmount(calculatedTotal)
    }
  }, [data]);


  return (
    <div className="p-4  w-full rounded-lg shadow-lg max-w-xs flex flex-col gap-3 h-max">
      <h2 className="text-2xl underline mb-4">Summary</h2>
      <div className="total grid grid-cols-2 gap-4">
        <p className="font-semibold">Total Price</p>
        <p>${totalPrice.toFixed(2)}</p>
      </div>
      <div className="discount grid grid-cols-2 gap-4">
        <p className="font-semibold">Discount</p>
        <p>{discount.toFixed(2)}%</p>
      </div>
      <div className="subTotal grid grid-cols-2 gap-4">
        <p className="font-semibold">Sale Price</p>
        <p>${salePrice.toFixed(2)}</p>
      </div>
      <div className="gst grid grid-cols-2 gap-4">
        <p className="font-semibold">GST (18%)</p>
        <p>+ ${gst.toFixed(2)}</p>
      </div>
      <div className="shippingFee grid grid-cols-2 gap-4 mb-6">
        <p className="font-semibold">Shipping</p>
        <p>+ ${shipping.toFixed(2)}</p>
      </div>
      <div className="grandTotal grid grid-cols-2 gap-4 border-t-2 pt-4">
        <p className="font-semibold">Total</p>
        <p>${total.toFixed(2)}</p>
      </div>
    </div>
  )
}
