import ProductCard from "./ProductCard";

interface ProductOrder {
  _id: string,
  productName: string,
  productDescription: string,
  productRating: number,
  productTotalPrice: number,
  productSalePrice: number,
  quantity: number,
  productImages: any
}

export default function ProductOrderCard({ data }: { data: ProductOrder }) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 w-max m-auto">
      <ProductCard description={false} rating={false} price={true} data={data} cartBtn={false} />
      <div className="font-extrabold">Quantity : {data?.quantity}</div>
    </div>
  );
}