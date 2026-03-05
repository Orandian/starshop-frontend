"use client";

import React from "react";
import SectionLayout from "@/components/layouts/SectionLayout";
import TitleText from "@/components/app/TitleText";
import ProductBoxComponent from "../app/public/ProductBoxComponent";
import ButtonLink from "@/components/app/ButtonLink";
import { usePublicRankingProductsList } from "@/hooks/user/useProduct";
import { Product } from "@/types/dashboard/products";
import { getPublicUrl } from "@/utils";

const RankingSectionComponent = () => {
  const { data: products } = usePublicRankingProductsList();
  const productList = (products?.data ?? []) as Product[];

  return (
    <>
      <SectionLayout className="my-14 md:my-28 h-auto">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="relative">
            <TitleText
              title="Ranking"
              subtitle="人気ランキング"
              className="text-[#786464]"
            />
            <div className="absolute top-3 right-0 hidden md:block">
              <ButtonLink href="/ranking" className="">
                もっと見る
              </ButtonLink>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {productList.slice(0, 4).map((item: Product, index: number) => (
              <ProductBoxComponent
                key={item.productId}
                product={{
                  id: item.productId || 0,
                  name: item.name,
                  url: getPublicUrl(
                    item.images?.find((image) => image.imageOrder === 1)
                      ?.imageUrl || ""
                  ),
                  image: getPublicUrl(
                    item.images?.find((image) => image.imageOrder === 1)
                      ?.imageUrl || ""
                  ),
                  brand: { name: item.brandName || "" },
                  rank: index + 1,
                }}
                displayRank={index + 1}
              />
            ))}
          </div>
          {productList?.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm md:text-base text-gray-400 font-semibold whitespace-nowrap">
                商品がありません。
              </p>
            </div>
          )}
          <div className="block md:hidden text-right mt-5">
            <ButtonLink href="/ranking" className="">
              もっと見る
            </ButtonLink>
          </div>
        </div>
      </SectionLayout>
    </>
  );
};

export default RankingSectionComponent;
