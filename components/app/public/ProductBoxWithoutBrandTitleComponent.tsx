"use client"

import React from "react";
import { cn } from "@/lib/utils";
import { RankingNewArrivalType } from "@/types/products";
import { convertToYen, encryptString } from "@/utils";
import { useRouter } from "next/navigation";
import Image from "next/image";

type ProductBoxWithoutBrandProps = {
  product: RankingNewArrivalType;
};

const ProductBoxWithoutBrandTitleComponent = ({
  product,
}: ProductBoxWithoutBrandProps) => {
  const router = useRouter();
  return (
    <div
      className={cn(
        "w-full flex items-center justify-start flex-col bg-[#f0efea] p-4 gap-1 md:gap-2 cursor-pointer relative"
      )}
      onClick={() => router.push(`/products/${encryptString(product.id.toString())}`)}
    >
      <div className="w-full h-[150px] md:h-[200px] relative">
        {product.url ? (
          <Image
            src={product.url}
            alt={product.name}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
          </div>
        )}
      </div>
      <div className="flex flex-col items-center gap-1 mt-4">
        <p
          className={cn(
            "text-center font-noto text-xs ",
            product.brand?.name === "EXOMERE"
              ? "text-[#f17e7d]"
              : product.brand?.name === "D.PL Cell"
                ? "text-[#723a5a]"
                : "text-dark"
          )}
        >
          {product.name}
        </p>
        {product.price !== undefined && (
          <div className="flex flex-col items-center justify-center min-h-[2.5rem] leading-5 text-center">
            <span className="text-price ">
              {convertToYen(product?.price || 0)}
            </span>
            <span className="text-small">
              {product.isTax ? "[税込]" : "[税別]"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductBoxWithoutBrandTitleComponent;
