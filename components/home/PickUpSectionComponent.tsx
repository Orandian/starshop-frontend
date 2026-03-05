import React from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import SectionLayout from '@/components/layouts/SectionLayout';
import TitleText from '@/components/app/TitleText';
import Image from 'next/image';
import Link from 'next/link';
const brandImages = [
  {
    id: 1,
    src: "/home/pickup/pickupExomere.jpg",
    href: "https://exomere.star-shop.co/"// "/exomere"
  },
  {
    id: 2,
    src: "/home/pickup/pickupDpl.jpg",
    href: "https://dplcell.star-shop.co/"// "/dpl"
  },
  {
    id: 3,
    src: "/home/pickup/melikey.png",
    href: "/melikey"
  },
];

const PickUpSectionComponent = () => {
  return (
    <SectionLayout className="mt-4 mb-14 md:mt-8 md:mb-28 h-auto">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <TitleText
          title="Pick Up"
          subtitle="注目のブランド"
          className="text-[#786464]"
        />
        <div>
          <Carousel opts={{ align: "start", slidesToScroll: 1 }} className="w-[90%] md:w-full md:max-w-[600px] lg:max-w-[800px] mx-auto">
            <CarouselContent>
              {brandImages.map((brand) => (
                <CarouselItem key={brand.id} className="basis-1/2">
                  <Link
                    href={brand.href}
                    className="block h-full"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="flex items-center justify-center h-full border border-white-bg bg-[#f0efea]/90">
                      <Image
                        src={brand.src}
                        alt={`Brand ${brand.id}`}
                        width={555}
                        height={460}
                        className="object-cover"
                      />
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="max-md:-left-[6%]" />
            <CarouselNext className="max-md:-right-[6%]" />
          </Carousel>
        </div>
      </div>
    </SectionLayout>
  );
}

export default PickUpSectionComponent;
