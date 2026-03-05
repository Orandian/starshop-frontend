import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import imageTwoCellsPc from "@/public/home/philosophy/imageTwoCellsPc.png";
import twoCellsImage1 from "@/public/home/philosophy/twoCellsImage1.png";

const TwoCellsSectionComponent = () => {
  return (
    <>
      <section className="w-full h-auto bg-[#f2e6e0] bg-opacity-10">
        <div className="container mx-auto px-0 md:px-6 lg:px-8">
          <div
            className="relative max-w-[900px] mx-auto flex flex-row items-center justify-end bg-cover bg-[position:26%_100%] bg-no-repeat"
            style={{ backgroundImage: `url(${imageTwoCellsPc.src})` }}
          >
            <div className="w-[60%] py-10 md:py-10 px-4 md:px-0 text-left md:text-center">
              <p className="text-base font-noto text-[#786464] text-left md:text-center leading-8 my-4">
                StarShopが誇る
                <br />
                肌本来の力を
                <br className="block md:hidden" />
                引き出す2つの幹細胞
              </p>
              <div className="max-w-[200px] md:mx-auto mb-5">
                <Image
                  src={twoCellsImage1}
                  alt="imagePC"
                  className="object-contain w-full h-full"
                />
              </div>
              <Button
                variant="outline"
                className=" border-[#786464] rounded-none h-7"
              >
                <Link
                  href="/stemcells"
                  className="text-[#786464] text-xs md:text-normal"
                >
                  詳しくはこちらから
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TwoCellsSectionComponent;
