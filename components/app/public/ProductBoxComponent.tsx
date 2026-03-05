"use client";

import React from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { RankingNewArrivalType } from '@/types/products';
// import brandExomereTtl from "@/public/products/brandExomereTtl.png";
// import brandDplcellTtl from "@/public/products/brandDplcellTtl.png";
import { convertToYen, encryptString } from '@/utils';
import { useRouter } from 'next/navigation';

type ProductBoxProps = {
  product: RankingNewArrivalType;
  displayRank?: number;
};

const isValidUrl = (url: string | undefined | null) => {
  try {
    if (!url) return false;
    new URL(url); // throws error if invalid
    return true;
  } catch {
    return false;
  }
};
const ProductBoxComponent = ({ product, displayRank }: ProductBoxProps) => {
  const router = useRouter();
  // const brandLogo =
  //   product.brand?.name === "exomere"
  //     ? brandExomereTtl
  //     : product.brand?.name === "dplcell"
  //       ? brandDplcellTtl
  //       : undefined;
  const rankColors = ["bg-[#c7b27e]", "bg-[#b3b3b3]", "bg-[#c29075]", "bg-[#f17e7d]"];
  const rankBg = displayRank
    ? rankColors[(displayRank - 1) % rankColors.length]
    : "bg-gray-400";
  return (
    <>
      <div
        className={cn(
          "w-full flex items-center justify-start flex-col bg-[#f0efea] p-4 gap-1 md:gap-2 cursor-pointer relative"
        )}
        onClick={() =>
          router.push(`/products/${encryptString(product.id.toString())}`)
        }
      >
        {/* Ranking Badge */}
        {product?.rank && product.rank > 0 && (
          <div
            className={cn(
              "absolute top-2 left-2 z-10 flex items-center justify-center w-10 h-10 rounded-full text-white text-xl font-bold font-cormorant",
              rankBg
            )}
          >
            {displayRank}
          </div>
        )}
        {/* Product Image */}
        <div className="w-full h-48 relative flex items-center justify-center">
          {isValidUrl(product?.url) ? (
            <Image
              src={product.url || ""}
              alt={product.name}
              fill
              className="object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs" />
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col items-center gap-1 mt-4">
          <div className="mt-4 text-center min-h-[2.5rem]">
            <p
              className={cn(
                "text-center font-noto text-xs ",
                // product.brand?.name === "EXOMERE"
                //   ? "text-[#f17e7d]"
                //   : product.brand?.name === "D.PL Cell"
                //     ? "text-[#723a5a]"
                //     : "text-dark"
              )}
            >
              {product.name}
            </p>
          </div>

          {product.price !== undefined && (
            <div className="flex flex-col items-center justify-center min-h-[2.5rem] leading-5 text-center">
              <span className="text-price">
                {convertToYen(product?.price || 0)}
              </span>
              <span className="text-small">
                {product.isTax ? "[税込]" : "[税別]"}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ProductBoxComponent;
