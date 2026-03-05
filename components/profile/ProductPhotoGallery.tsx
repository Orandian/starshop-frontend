"use client";

import { useRef, useState } from "react";
import Image from "next/image";
// import { ArrowDown, ArrowUp } from "lucide-react";

const ProductPhotoGallery = ({
  products,
}: {
  products: { id: number; name: string; image: string }[];
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const thumbsRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setActiveIndex((prev) => (prev + 1) % products.slice(0, 2).length);
  //   }, 3000);
  //   return () => clearInterval(interval);
  // }, [products]);

  //   const scrollToPrevious = () => {
  //     if (activeIndex === 0) {
  //       setActiveIndex(products.length - 1);
  //     } else {
  //       setActiveIndex(activeIndex - 1);
  //     }
  //   };

  //   const scrollToNext = () => {
  //     if (activeIndex === products.length - 1) {
  //       setActiveIndex(0);
  //     } else {
  //       setActiveIndex(activeIndex + 1);
  //     }
  //   };

  return (
    <div className="w-full md:w-[70%] flex space-x-6 md:space-y-6 space-y-2 sticky top-0 md:flex-row flex-col">
      {products.length > 0 && (
        <div className="relative max-h-[300px] pr-1" ref={thumbsRef}>
          <div className="md:space-y-2 space-x-2 flex md:flex-col flex-row ">
            {products.map((product, index) => (
              <div
                key={product.id}
                className={`w-[50px] h-[50px] bg-white-bg cursor-pointer ${
                  activeIndex === index ? "border border-dark/50" : ""
                }`}
                onClick={() => setActiveIndex(index)}
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  width={50}
                  height={50}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </div>

          {/* {products.length > 5 && (
          <>
          <button
            className="absolute -top-1 left-1/2 -translate-x-1/2 bg-white shadow-md rounded-full p-1 hover:bg-gray-100 cursor-pointer"
            onClick={scrollToPrevious}
          >
            <ArrowUp size={18} />
          </button>
          <button
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-white shadow-md rounded-full p-1 hover:bg-gray-100 cursor-pointer"
            onClick={scrollToNext}
          >
            <ArrowDown size={18} />
          </button>
          </>
        )} */}
        </div>
      )}

      {/* Main Image */}
      {products[activeIndex] && (
        <div className="w-full h-[300px] md:h-[500px] bg-white-bg flex items-center justify-center">
          <Image
            src={products[activeIndex]?.image}
            alt={products[activeIndex]?.name}
            width={600}
            height={600}
            className="w-full h-[300px] md:h-[500px] object-contain"
          />
        </div>
      )}
      {!products[activeIndex] && (
        <div className="w-full h-[500px] pl-2">
          <p>商品の画像がありません</p>
        </div>
      )}
    </div>
  );
};

export default ProductPhotoGallery;
