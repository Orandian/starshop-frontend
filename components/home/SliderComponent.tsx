"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Image, { StaticImageData } from "next/image";
import { HiChevronDoubleDown, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { Product } from "@/types/products";
import { encryptString, getPublicUrl, trimString } from "@/utils";
import { useRouter } from "next/navigation";

interface ImageSliderProps {
  images: {
    src: StaticImageData;
    alt: string;
  }[];
  autoPlayInterval?: number;
  autoPlayProductInterval?: number;
  showNavigationArrows?: boolean;
  products: Product[];
}

const SliderComponent = ({
  images,
  autoPlayInterval = 5000,
  autoPlayProductInterval = 5000,
  showNavigationArrows = true,
  products,
}: ImageSliderProps) => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentProduct, setCurrentProduct] = useState(0);

  // Image auto play
  useEffect(() => {
    if (!autoPlayInterval) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlayInterval, images.length]);

  // Product auto play
  useEffect(() => {
    if (!autoPlayProductInterval) return;

    const interval = setInterval(() => {
      setCurrentProduct((prevProduct) =>
        prevProduct + 1 >= products?.length ? 0 : prevProduct + 1
      );
    }, autoPlayProductInterval);

    return () => clearInterval(interval);
  }, [autoPlayProductInterval, products?.length]);

  // Go to next image
  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Go to previous image
  const goToPrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  // Go to slide
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Go to next product
  const goToNextProduct = () => {
    if (currentProduct + 1 >= products?.length) return;
    setCurrentProduct((prevProduct) =>
      prevProduct + 1 >= products?.length ? 0 : prevProduct + 1
    );
  };

  // Go to previous product
  const goToPreviousProduct = () => {
    if (currentProduct - 1 < 0) return;
    setCurrentProduct((prevProduct) =>
      prevProduct - 1 < 0 ? products?.length - 1 : prevProduct - 1
    );
  };

  // To two digit
  const toTwoDigit = (countNumber: number) => {
    return countNumber < 10 ? `0${countNumber}` : countNumber;
  };

  const handleProductClick = (productId: number) => {
    router.push(`/products/${encryptString(productId.toString())}`);
  };

  return (
    <div className="md:h-screen h-[500px] overflow-hidden bg-black relative">
      {images.map((image, index) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 h-full w-full transition-opacity duration-1000",
            index === currentIndex ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="relative h-full w-full">
            <Image
              src={image.src}
              alt={image.alt}
              className="md:h-full h-[500px] w-full object-cover"
            />
          </div>
        </div>
      ))}

      {showNavigationArrows && (
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/50"
          aria-label="Previous slide"
        >
          <HiChevronLeft className="h-6 w-6" />
        </button>
      )}

      {showNavigationArrows && (
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/50"
          aria-label="Next slide"
        >
          <HiChevronRight className="h-6 w-6" />
        </button>
      )}

      <div className="hidden md:block absolute bottom-[20%] right-10 z-10 md:flex md:flex-col items-center gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "rounded-full bg-white transition-all cursor-pointer",
              index === currentIndex
                ? "h-[10px] w-[10px] opacity-100"
                : "h-[6px] w-[6px] opacity-70 hover:opacity-100"
            )}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentIndex ? "true" : "false"}
          />
        ))}
        <HiChevronDoubleDown
          size={14}
          onClick={goToNext}
          className="cursor-pointer text-white"
        />
      </div>

      <div className="hidden md:block absolute bottom-[10%] w-full">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="w-[200px] h-[250px] bg-white shadow-2xl drop-shadow-2xl">
            <div className="p-3 space-y-2">
              <div className="bg-white-bg w-full h-[150px] flex items-center justify-center">
                <Image
                  src={
                    products?.[currentProduct]?.product_images?.[0]?.image_url
                      ? getPublicUrl(
                          products?.[currentProduct]?.product_images?.[0]
                            .image_url
                        )
                      : "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  }
                  alt={products?.[currentProduct]?.name || "Product Image"}
                  width={200}
                  height={200}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="h-[45px]">
                  <p
                    onClick={() =>
                      handleProductClick(
                        products?.[currentProduct]?.product_id || 0
                      )
                    }
                    className="text-sm text-dark cursor-pointer underline"
                  >
                    {trimString(products?.[currentProduct]?.name || "", 20)}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-dark cursor-pointer">
                    {toTwoDigit(currentProduct + 1)} /{" "}
                    {toTwoDigit(products?.length || 0)}
                  </p>

                  <div className="flex space-x-0.5">
                    <HiChevronLeft
                      size={20}
                      onClick={goToPreviousProduct}
                      className={
                        "cursor-pointer text-dark" +
                        (currentProduct === 0 ? " opacity-50" : "")
                      }
                    />
                    <HiChevronRight
                      size={20}
                      onClick={goToNextProduct}
                      className={
                        "cursor-pointer text-dark" +
                        (currentProduct === products?.length - 1
                          ? " opacity-50"
                          : "")
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SliderComponent;
