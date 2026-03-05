"use client";

import React, { useState, useEffect, useMemo } from "react";
import PublicDetailsLayout from "@/components/layouts/PublicDetailsLayout";
import { cn } from "@/lib/utils";
import { usePublicBrands } from "@/hooks/useBrands";
import { BrandType } from "@/types/dashboard/brands";
import { usePublicNewArrivalProductsList } from "@/hooks/user/useProduct";
import { Product } from "@/types/dashboard/products";
import { getPublicUrl } from "@/utils";
import ProductItemComponent from "@/components/app/public/ProductItemComponent";
import { Skeleton } from "@/components/ui/skeleton";

const NewArrivalPage = () => {
    const [brand, setBrand] = useState<string>("all");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [brandName, setBrandName] = useState<string>("all");
    // Custom hook to fetch product data
    const { data: brands } = usePublicBrands();
    const brandList = useMemo(() => (brands?.data?.data ?? []) as BrandType[], [brands]);
    const { data: products , isLoading} = usePublicNewArrivalProductsList();
    const productList = useMemo(() => (products?.data ?? []) as Product[],[products]);
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

  const filteredProducts = useMemo(
    () =>
      productList.filter(
        (p) =>
          p.isNewArrival &&
          (brand === "all" || p.brandId.toString() === brand)
      ),
    [brand, productList]
  );

  return (
    <PublicDetailsLayout>
      <div className="px-4 md:px-0">
        <h1 className="text-3xl font-bold font-cormorant text-center mb-8 text-[#786464]">
          NEW ARRIVAL
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {!isLoading &&
            filteredProducts?.map((product: Product) => (
              <ProductItemComponent
                key={product.productId}
                product={{
                  id: product.productId || 0,
                  name: product.name,
                  price: product.tax
                    ? product.salePrice +
                    (product.salePrice * product.tax) / 100
                    : product.salePrice,
                  image: product.images?.filter(
                    (image) => image?.imageOrder === 1
                  )[0]?.imageUrl
                    ? getPublicUrl(product?.images?.filter(
                      (image) => image.imageOrder === 1)[0]?.imageUrl)
                    : 'https://images.unsplash.com/photo-1541363111435-5c1b7d867904?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                  isTax: !!product.tax,
                  imgBg: false,
                }}
              />
            ))}
          {isLoading &&
            Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={index}
                className="w-full h-64 bg-white-bg border border-black/10"
              />
            ))}
        </div>
          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {filteredProducts?.map((product: Product, index: number) => (
              <ProductBoxComponent
                key={product.productId}
                product={{
                  id: product.productId || 0,
                  name: product.name,
                  url: product.images?.filter(
                    (image) => image?.imageOrder === 1
                  )[0]?.imageUrl
                    ? getPublicUrl(product?.images?.filter(
                      (image) => image.imageOrder === 1)[0]?.imageUrl)
                    : 'https://images.unsplash.com/photo-1541363111435-5c1b7d867904?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
               // getPublicUrl(product.images?.[0]?.imageUrl || ""),
                  image: product.images?.filter(
                    (image) => image?.imageOrder === 1
                  )[0]?.imageUrl
                    ? getPublicUrl(product?.images?.filter(
                      (image) => image.imageOrder === 1)[0]?.imageUrl)
                    : 'https://images.unsplash.com/photo-1541363111435-5c1b7d867904?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
               // getPublicUrl(product.images?.[0]?.imageUrl || ""),
              
                  brand: {
                    name: brandName.toLowerCase() === "all" ? "" : brandName.toLowerCase().replace(" ", ""),
                  },
                  rank: index + 1,
                }}
                displayRank={index + 1}
              />
            ))}
          </div> */}
          {productList?.length === 0 && (
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

export default NewArrivalPage;
