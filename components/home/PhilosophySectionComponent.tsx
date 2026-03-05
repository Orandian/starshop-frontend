import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import imagePC from "@/public/home/philosophy/imagePC.png";
import imageSp from "@/public/home/philosophy/imageSp.png";

const PhilosophySectionComponent = () => {
  return (
    <>
      <section className="w-full h-auto bg-[#dfdad1] bg-opacity-10">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="relative max-w-[900px] mx-auto flex flex-row items-center">
            <div className="w-[60%] md:w-[40%] relative z-[1] py-10 md:py-5 text-left md:text-center">
              <h2 className="text-2xl md:text-2xl font-cormorant text-[#786464] text-center leading-7 my-2">
                ABOUT <br />
                OUR PHILOSOPHY
              </h2>
              <p className="text-small font-noto text-[#786464] text-center mb-4">
                わたしたちが大切にしていること
              </p>
              <p className="text-base font-noto text-[#786464] text-left md:text-center leading-6 my-4">
                年齢に負けない。
                <br />
                肌本来の美しさを、
                <br className="block md:hidden" />
                もっと高めるエイジングケア
              </p>
              <Button
                variant="outline"
                className=" border-[#786464] rounded-none h-7"
              >
                <Link
                  href="/philosophy"
                  className="text-[#786464] text-xs md:text-normal"
                >
                  詳しくはこちらから
                </Link>
              </Button>
            </div>
            <div className="w-[60%] hidden md:block">
              <Image
                src={imagePC}
                alt="imagePC"
                className="object-contain"
                width={500}
                height={500}
              />
            </div>
            <div className="w-auto md:hidden absolute bottom-0 right-0 -mr-4">
              <Image
                src={imageSp}
                alt="imageSp"
                className="object-contain object-bottom-right"
                width={300}
                height={300}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PhilosophySectionComponent;
