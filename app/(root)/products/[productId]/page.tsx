import CartBtn from "@/components/CartBtn";
import ImageSlider from "@/components/ImageSlider";
import { Button } from "@/components/ui/button";
import handleRating from "@/utils/handleRating";
import axios from "axios";
import Link from "next/link";

async function fetchItem(productId: string) {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/item`;
    const res = await axios.get(url, { params: { productId } });

    if (!res.data || !res.data.item) {
      throw new Error("Invalid API response: 'item' is missing");
    }

    return res.data.item;
  } catch (error) {
    console.error("Failed to fetch item:", error);
    return null;
  }
}


export default async function Item({ params }: { params: any }) {
  const { productId } = await params;

  const item = await fetchItem(productId);
  const star = handleRating(item?.productRating)



  if (!item) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        Failed to load item. Please try again later.
      </div>
    );
  }

  return (
    <div className="w-full h-full flex lg:flex-row flex-col lg:px-60 border rounded py-7">
      <ImageSlider images={item.productImages} />

      {/* Info Section */}
      <div className="viewBody-about px-7  py-7  lg:w-1/2 w-full ">
        <div className="viewBody-about-title text-3xl my-3 font-extrabold">{item?.productName}</div>
        <div className="viewBody-about-rating text-green-800 text-2xl">{star} {item?.productRating}/5</div>
        <div className="viewBody-about-price flex gap-3 items-center my-2">
          <div className="viewBody-about-total text-xl font-bold">${item?.productSalePrice}</div>
          <div className="viewBody-about-actual line-through text-2xl">${item?.productTotalPrice}</div>
        </div>
        <div>
          <div className="viewBody-about-description py-7 rounded-lg">
            <h1 className="font-bold underline text-2xl my-3">Description</h1>
            <div className="break-words">{item?.productDescription}</div>
          </div>
          <div className="w-full relative">
            <CartBtn productId={item?._id} />
            <Link href={`/order/${item?._id}`}>
              <Button variant={'checkout'} className="absolute right-0">Checkout</Button>
            </Link>
          </div>
        </div>
      </div>


    </div>
  );
}
