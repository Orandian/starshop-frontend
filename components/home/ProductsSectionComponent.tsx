"use client"

import React, { useEffect, useState } from "react";
import SectionLayout from "@/components/layouts/SectionLayout";
import TitleText from "@/components/app/TitleText";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProductBoxWithoutBrandTitleComponent from "../app/public/ProductBoxWithoutBrandTitleComponent";
import { usePublicBrands } from "@/hooks/useBrands";
import { usePublicProductsList } from "@/hooks/user/useProduct";
import { cn } from "@/lib/utils";
import { Product } from "@/types/dashboard/products";
import { BrandType } from "@/types/dashboard/brands";
import { getPublicUrl } from "@/utils";
import { Skeleton } from "../ui/skeleton";

//   {
//     id: 1,
//     name: "インフラポーション ローション",
//     image: image1,
//     rank: 0,
//     brand: { name: "EXOMERE" },
//   },
//   {
//     id: 2,
//     name: "アロマモイスト ミスト",
//     image: image2,
//     rank: 0,
//     brand: { name: "EXOMERE" },
//   },
//   {
//     id: 3,
//     name: "クリームミスト",
//     image: image3,
//     rank: 0,
//     brand: { name: "D.PLCell" },
//   },
//   {
//     id: 4,
//     name: "UV栄養クリーム",
//     image: image4,
//     rank: 0,
//     brand: { name: "D.PLCell" },
//   },
// ];
// const brandValueMap: Record<string, string> = {
//   exomere: "EXOMERE",
//   dplcell: "D.PLCell",
// };
const brandDescriptions: Record<string, React.ReactNode> = {
  exomere: (
    <>
      肌のハリやシワ、くすみに悩むあなたへ ― <br className="md:hidden" />
      年齢サインに本気で挑むEXOMERE（エクソミア）。 <br />
      針状の美容成分が奥深くまで届き、ターンオーバーをサポート。
      <br className="md:hidden" />
      肌の奥から引き締め、なめらかで弾力のある素肌へ導きます。
    </>
  ),
  dplcell: (
    <>
      乾燥やたるみ、年齢肌のゆらぎに悩むあなたへ ― <br className="md:hidden" />
      次世代エイジングケアとして肌の土台から整える
      <br className="md:hidden" />
      D.PL Cell（ディプルセル）。 <br />
      自然由来成分と先端美容技術で、
      <br className="md:hidden" />
      ふっくら弾力のあるシルク肌へ導きます。
    </>
  ),
  all: <>全ての商品一覧をご覧いただけます。</>,
};

const ProductsSectionComponent = () => {
  const [brand, setBrand] = useState<string>("All");
  const [brandName, setBrandName] = useState<string>("All");

  const { data: brands } = usePublicBrands();
  const { data: products, isLoading } = usePublicProductsList(brandName, 1, 20);
  const productList = (products?.data?.data ?? []) as Product[];

  const [brandTabs, setBrandTabs] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    const brandList = (brands?.data?.data ?? []) as BrandType[];
    if (brandList && brandList.length > 0) {
      setBrandTabs([
        { value: "All", label: "All" },
        ...brandList.map((item) => ({
          value: item.brandId.toString(),
          label: item.name,
        }))
      ]);
    }
  }, [brands]);

  return (
    <>
      <SectionLayout className="my-14 md:my-28 h-auto">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <TitleText
            title="Products"
            subtitle="商品一覧"
            className="text-[#786464]"
          />

          {/* Tabs List */}
          <div className="flex flex-wrap justify-center mx-auto h-auto gap-4 md:gap-5 mb-4 md:mb-6">
            {brandTabs.map((tab) => (
              <div
                key={tab.value}
                className={cn(
                  "group py-0 text-[#786464] font-semibold border-0 rounded-none shadow-none data-[state=active]:!shadow-none bg-transparent flex-none",
                  {
                    "border-b-2 border-[#786464]": brand === tab.value,
                  }
                )}
                onClick={() => {
                  setBrand(tab.value);
                  setBrandName(tab.label);
                }}
              >
                <span className="inline-block border-b-2 border-transparent group-data-[state=active]:border-[#786464] cursor-pointer">
                  {tab.label}
                </span>
              </div>
            ))}
          </div>

          <div>
            {/* Brand Description */}
            <p className="text-center text-sm md:text-base text-gray-700 font-semibold">
              {
                brandDescriptions[
                brandName
                  .toLowerCase()
                  .replace(" ", "") as keyof typeof brandDescriptions
                ]
              }
            </p>

            {/* Product List */}
            <div className="relative my-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 my-5">
                {isLoading ? (
                  Array.from({ length: 8 }).map((_, index) => (
                    <Skeleton key={index} />
                  ))
                ) : (
                  productList?.map((item) => {
                    // Get first image order = 0
                    const firstImage =
                      item.images?.find((image) => image.imageOrder === 1)?.imageUrl ||
                      "";
                    return (
                      <ProductBoxWithoutBrandTitleComponent
                        key={item.productId}
                        product={{
                          id: item.productId ?? 0,
                          name: item.name,
                          image: firstImage,
                          url: getPublicUrl(firstImage),
                          brand: {
                            name:
                              brandName?.toLowerCase() === "all"
                                ? ""
                                : brandName?.toLowerCase().replace(" ", "") ?? "",
                          },
                        }}
                      />
                    );
                  })
                )}
              </div>
              {productList?.length === 0 && (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm md:text-base text-gray-400 font-semibold whitespace-nowrap">
                    このブランドの商品はまだありません。
                  </p>
                </div>
              )}
              {/* More Button */}
              {productList?.length > 0 && (
                <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-white via-white/70 to-transparent flex justify-center items-end">
                  <Button
                    variant="outline"
                    className="border-[#786464] rounded-none w-[150px] h-7 bg-white"
                  >
                    <Link
                      href={
                        brandName === "all"
                          ? "/products"
                          : brandName === "DPL Cell"
                            ? "/dpl"
                            : brandName === "EXOMERE"
                              ? "/exomere"
                              : {
                                pathname: "/products",
                                query: { brand : brandName },
                              }
                      }
                      className="text-[#786464] text-xs md:text-normal"
                    >
                      もっと見る
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </SectionLayout>
    </>
  );
};

export default ProductsSectionComponent;
