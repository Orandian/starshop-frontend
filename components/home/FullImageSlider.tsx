"use client";

import React from "react";
import Slider from "react-slick";
import Image, { StaticImageData } from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

type FullImageSliderProps = {
  images: {
      src: StaticImageData;
      alt: string;
    }[];
};

const FullImageSlider: React.FC<FullImageSliderProps> = ({ images }) => {
  const settings = {
    dots: images?.length > 1,
    arrows: false,
    infinite: images?.length > 1,
    initialSlide: 0,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="w-full mx-auto relative">
      <Slider {...settings}>
        {images.map((image, idx) => (
          <div key={idx} className="relative">
            <Image
              src={image.src}
              alt={`slide-${idx}`}
              className="w-full h-full object-cover"
              priority={idx === 0}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default FullImageSlider;
