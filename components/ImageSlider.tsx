'use client'

import Image from "next/image";
import { useState } from "react";


export default function ImageSlider({ images }: { images: any }) {
  const [previouslight, setPreviousLight] = useState<boolean>(false);
  const [nextlight, setNextLight] = useState<boolean>(false);
  const [length,] = useState<number>(images.length);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  function handlePreviousBtn() {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setNextLight(false)
    } else if (currentIndex === 0) {
      setPreviousLight(true)
    }
  }

  function handleNextBtn() {
    if (currentIndex < length - 1) {
      setCurrentIndex(currentIndex + 1);
      setPreviousLight(false)
    } else if (currentIndex === images.length - 1) {
      setNextLight(true)

    }
  }




  return (
    <div className="img flex gap-3 items-center justify-center relative  lg:w-1/2 w-full py-7">
      <svg onClick={handlePreviousBtn} className="h-11 cursor-pointer active:scale-95" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path fill={`${previouslight ? "#99c1f1" : "#1c71d8"}`} d="M9.4 278.6c-12.5-12.5-12.5-32.8 0-45.3l128-128c9.2-9.2 22.9-11.9 34.9-6.9s19.8 16.6 19.8 29.6l0 256c0 12.9-7.8 24.6-19.8 29.6s-25.7 2.2-34.9-6.9l-128-128z" /></svg>
      <Image
        alt={"Item"}
        width={350}
        height={300}
        src={images[currentIndex].url}
        className="shadow-lg rounded h-80 w-1/2"

      />
      <svg onClick={handleNextBtn} className="h-11 cursor-pointer active:scale-95" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path fill={`${nextlight ? "#99c1f1" : "#1c71d8"}`} d="M246.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-9.2-9.2-22.9-11.9-34.9-6.9s-19.8 16.6-19.8 29.6l0 256c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l128-128z" /></svg>
    </div>
  )
}