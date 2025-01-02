'use client'

import { useState } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

type Product = {
  _id: string;
  productName: string;
  productDescription: string;
  productRating: number;
  productTotalPrice: number;
  productSalePrice: number;
  productImages: { url: string }[];
};

export default function Filter({ setProducts }: { setProducts: (data: Product[]) => void }) {
  const [filterPrice, setFilterPrice] = useState<string>('');
  const router = useRouter()
  const [filter, setFilter] = useState<boolean>(false)

  // Handle filter price change
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setFilterPrice(value);
    } else {
      setFilterPrice('');
    }
  };

  // Fetch products based on filter
  const fetchFilteredProducts = async () => {
    if (!filterPrice) return;

    try {
      const response = await axios.get(`/api/filtered?filteredPrice=${filterPrice}`);
      if (response.data.success) {
        setProducts(response.data.data);

      }
    } catch (error) {
      console.error('Error fetching filtered products:', error);
    }
  };

  // Apply filter when the user clicks on the "Apply" button
  const handleApplyFilter = () => {
    fetchFilteredProducts();
    router.push(`/category/filtered?filteredPrice=${filterPrice}`)
  };

  return (
    <div className="flex justify-end items-center w-full gap-3">
      {filter && <div className="w-full font-work-sans border">
        <div className="price p-3">
          <h1 className="text-2xl font-bold">Price</h1>

          <label>
            <input
              type="checkbox"
              value="Less_than_100"
              checked={filterPrice === 'Less_than_100'}
              onChange={handleOnChange}
              className="m-3"
            />
            Less than $100
          </label>

          <label>
            <input
              type="checkbox"
              value="100_1000"
              checked={filterPrice === '100_1000'}
              onChange={handleOnChange}
              className="m-3"
            />
            $100 - $1000
          </label>

          <label>
            <input
              type="checkbox"
              value="More_than_1000"
              checked={filterPrice === 'More_than_1000'}
              onChange={handleOnChange}
              className="m-3"
            />
            More than $1000
          </label>

          <Button variant={'checkout'} className="ml-7" onClick={handleApplyFilter}>
            Apply
          </Button>
        </div>
      </div>}
      <svg onClick={() => setFilter((prev) => !prev)} className="h-11 cursor-pointer active:scale-95 my-2 border rounded lg:mr-7 p-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path fill="#77767b" d="M3.9 54.9C10.5 40.9 24.5 32 40 32l432 0c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9 320 448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6l0-79.1L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z" />
      </svg>

    </div>
  );
}



