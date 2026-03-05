"use client";

import React, { useEffect, useMemo, useState } from "react";
import PublicDetailsLayout from "@/components/layouts/PublicDetailsLayout";
import ProductBoxComponent from "@/components/app/public/ProductBoxComponent";
import { cn } from "@/lib/utils";
import { usePublicRankingProductsList } from "@/hooks/user/useProduct";
import { BrandType } from "@/types/dashboard/brands";
import { Product } from "@/types/dashboard/products";
import { usePublicBrands } from "@/hooks/useBrands";
import { getPublicUrl } from "@/utils";
import { Skeleton } from "@/components/ui/skeleton";

const RankingPage = () => {
  const [brand, setBrand] = useState<string>("all");
  const [brandName, setBrandName] = useState<string>("all");
  // Custom hook to fetch product data
  const { data: brands } = usePublicBrands();
  const brandList = useMemo(() => (brands?.data?.data ?? []) as BrandType[], [brands]);
  const { data: products , isLoading : isRankingLoading } = usePublicRankingProductsList();
  const productList =  useMemo(() => (products?.data ?? []) as Product[], [products]);
  const [brandTabs, setBrandTabs] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    if (brandList.length > 0) {
      setBrandTabs([
        { value: "all", label: "All" },
        ...brandList.map((brand: BrandType) => ({
          value: brand.brandId.toString(),
          label: brand.name,
        })),
      ]);
    }
  }, [brandList]);

  const filteredProducts = useMemo(() => {
    if (brand === "all") return productList;
    return productList.filter(
      (prod) => prod.brandId.toString() === brand
    );
  }, [brand, productList]);

  return (
    <PublicDetailsLayout>
      <div className="px-4 md:px-0">
        <h1 className="text-3xl font-bold font-cormorant text-center mb-8 text-[#786464]">
          RANKING
        </h1>
        <div className="w-full">
          {/* Tabs List */}
          <div className="flex flex-wrap justify-center mx-auto h-auto gap-4 md:gap-5 mb-4 md:mb-6">
            {brandTabs.map((tab) => (
              <button
                key={tab.value}
                value={tab.value}
                className={cn(
                  "group min-w-[100px] py-0 text-[#786464] font-semibold border-0 rounded-none shadow-none data-[state=active]:!shadow-none bg-transparent flex-none",
                  {
                    "border-b-2 border-[#786464]": brand === tab.value,
                  }
                )}
                onClick={() => {
                  setBrand(tab.value);
                  setBrandName(tab.label);
                }}
              >
                <span className="inline-block border-b-2 border-transparent group-data-[state=active]:border-[#786464]">
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {filteredProducts.length > 0 &&
              filteredProducts?.map((product: Product, index: number) => (
                <ProductBoxComponent
                  key={product.productId}
                  product={{
                    id: product.productId || 0,
                    name: product.name,
                    url: getPublicUrl(product.images?.[0]?.imageUrl || ""),
                    image:  product.images?.filter(
                    (image) => image?.imageOrder === 1
                  )[0]?.imageUrl
                    ? getPublicUrl(product?.images?.filter(
                      (image) => image?.imageOrder === 1)[0]?.imageUrl)
                    : 'https://images.unsplash.com/photo-1541363111435-5c1b7d867904?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                    // product.images?.[0].imageUrl || "",
                    brand: {
                      name: product.brandName || brandName// .toLowerCase() === "all" ? "" : brandName.toLowerCase().replace(" ", ""),
                    },
                    price: product.tax
                      ? product.salePrice + (product.salePrice * product.tax) / 100
                      : product.salePrice,
                    isTax: !!product.tax,
                    rank: index + 1,
                  }}
                  displayRank={index + 1}
                />
              ))}
          </div>
          {isRankingLoading &&
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton
                key={i}
                className="w-full h-64 bg-white-bg border border-black/10"
              />
            ))}
          {productList?.length === 0 && !isRankingLoading && (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm md:text-base text-gray-700 font-semibold whitespace-nowrap">
                商品はまだありません。
              </p>
            </div>
          )}
        </div>
      </div>
    </PublicDetailsLayout>
  );
};

export default RankingPage;
