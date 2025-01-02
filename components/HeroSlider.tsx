'use client'

import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface ProductImage {
  imageId: string;
  url: string;
}

interface Product {
  _id: string;
  productImages: ProductImage[];
}

const HeroSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [items, setItems] = useState<Product[]>([]);
  const [image, setImage] = useState<string>("");
  const [onHover, setOnHover] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    async function fetch() {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/heroSlider`);
        setItems(response.data.products);
      } catch (err) {
        console.log(err);
      }
    }

    fetch();
  }, []);

  useEffect(() => {
    if (items.length > 0 && items[currentIndex]?.productImages.length > 0) {
      setImage(items[currentIndex]?.productImages[0].url);  // Assuming the first image in the array
    }
  }, [currentIndex, items]);

  const handleNextBtn = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const handlePreviousBtn = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };

  useEffect(() => {
    let isMounted = true;

    const interval = setInterval(() => {
      if (isMounted) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
      }
    }, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [items.length]);

  return (
    <div className="heroSlider w-full relative cursor-pointer">
      <div className="flex justify-center items-center lg:h-56 bg-slate-950">
        {onHover && <svg
          onClick={handlePreviousBtn}
          className=" lg:h-7 h-3 absolute left-0 ml-2 z-10 cursor-pointer active:scale-95"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path
            fill="#3d3846"
            d="M459.5 440.6c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29l0-320c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4L288 214.3l0 41.7 0 41.7L459.5 440.6zM256 352l0-96 0-128 0-32c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4l-192 160C4.2 237.5 0 246.5 0 256s4.2 18.5 11.5 24.6l192 160c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29l0-64z"
          />
        </svg>}
        <div className="bg-slate-950 h-full" onMouseOver={() => setOnHover(true)} onMouseOut={() => setOnHover(false)} onClick={() => router.push(`products/${items[currentIndex]._id}`)}>
          {image ? <Image src={image} key={items[currentIndex]._id} fill className="m-auto bg-cover h-full" alt="Slider" /> : null}
        </div>
        {onHover && <svg
          onClick={handleNextBtn}
          className="lg:h-7 h-3 absolute right-0 mr-2 z-10 cursor-pointer active:scale-95"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path
            fill="#3d3846"
            d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416L0 96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4L224 214.3l0 41.7 0 41.7L52.5 440.6zM256 352l0-96 0-128 0-32c0-12.4-7.2-23.7-18.4-29s24.5-3.6 34.1 4.4l192 160c7.3 6.1 11.5 15.1 11.5 24.6s-4.2 18.5-11.5 24.6l-192 160c-9.5 7.9-22.8 9.7-34.1 4.4s-18.4-16.6-18.4-29l0-64z"
          />
        </svg>}
        <div className="flex gap-2 absolute z-10 bottom-1">
          {items.map((_, index) => (
            <svg
              key={index}
              className="lg:h-3 h-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill={currentIndex === index ? "#FFFFFF" : "#241f31"}
                d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"
              />
            </svg>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
