"use client";

import React, { useState } from "react";
import Slider from "react-slick";
import Image, { StaticImageData } from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRouter } from "next/navigation";

type FullImageSliderProps = {
    images: {
        src: StaticImageData;
        alt: string;
        href: string;
    }[];
};

const ClickableFullImageSlider: React.FC<FullImageSliderProps> = ({ images }) => {
    const router = useRouter();
    const [isDragging, setIsDragging] = useState(false);

    const settings = {
        dots: images.length > 1,
        arrows: false,
        infinite: images.length > 1,
        autoplay: images.length > 1,
        speed: 500,
        autoplaySpeed: 3000,
        slidesToShow: 1,
        slidesToScroll: 1,
        beforeChange: () => setIsDragging(true),
        afterChange: () =>
            setTimeout(() => setIsDragging(false), 0),
    };

    const handleClick = (href: string) => {
        if (!isDragging) {
            router.push(href);
        }
    };

    return (
        <div className="w-full mx-auto relative">
            <Slider {...settings}>
                {images.map((image, idx) => (
                    <div key={idx}>
                        <div
                            onClick={() => handleClick(image.href)}
                            className="relative cursor-pointer select-none"
                        >
                            <Image
                                src={image.src}
                                alt={image.alt}
                                className="w-full h-full object-cover pointer-events-none"
                                priority={idx === 0}
                            />
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default ClickableFullImageSlider;