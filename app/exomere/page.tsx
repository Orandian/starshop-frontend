"use client";

import TitleText from "@/components/app/TitleText";
import PublicDetailsLayout from "@/components/layouts/PublicDetailsLayout";
import ExomereDailyComponent from "@/components/app/public/daily/ExomereDailyComponent";
import ExomereSpecialComponent from "@/components/app/public/special/ExomereSpecialComponent";
import ProductBoxWithoutBrandTitleComponent from "@/components/app/public/ProductBoxWithoutBrandTitleComponent";
import { usePublicProductsList } from "@/hooks/user/useProduct";
import { Product } from "@/types/dashboard/products";
import { useEffect } from "react";
import { toast } from "sonner";
import { getPublicUrl } from "@/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function ExomerePage() {
  const { data: products, isError, error,isLoading } = usePublicProductsList("EXOMERE");
  const productList = (products?.data?.data ?? []) as Product[];
  // Handle select option
  useEffect(() => {
    if (isError) {
      toast.error(error?.message);
    }
  }, [isError, error]);

  return (
    <PublicDetailsLayout>
      <div className="px-4 md:px-0">
        <h1 className="text-3xl font-bold font-cormorant text-center mb-8 text-[#786464]">
          EXOMERE
        </h1>
        <p className="text-center text-sm md:text-base text-gray-700">
          肌のハリやシワ、くすみに悩むあなたへ ― <br className="md:hidden" />
          年齢サインに本気で挑むEXOMERE（エクソミア）。
          <br />
          針状の美容成分が奥深くまで届き、ターンオーバーをサポート。{" "}
          <br className="md:hidden" />
          肌の奥から引き締め、なめらかで弾力のある素肌へ導きます。
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 my-10 md:my-24">
            {/* {productList?.slice(0, 4).map((item: Product) => ( */}
            {productList?.map((item: Product) => (
              <ProductBoxWithoutBrandTitleComponent
                key={item.productId}
                product={{
                  id: item.productId || 0,
                  name: item.name,
                  image: item.images?.[0]?.imageUrl || "",
                  url: item.images?.filter(
                                      (image) => image?.imageOrder === 1
                                    )[0]?.imageUrl
                                      ? getPublicUrl(item?.images?.filter(
                                        (image) => image.imageOrder === 1)[0]?.imageUrl)
                                      : 'https://images.unsplash.com/photo-1541363111435-5c1b7d867904?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                  brand: {
                    name: item.brandName || "EXOMERE",
                  },
                  price: item.tax
                    ? item.salePrice + (item.salePrice * item.tax) / 100
                    : item.salePrice,
                  isTax: !!item.tax,
                  rank: 0,
                }}
              />
            ))}
            {isLoading &&
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton
                key={i}
                className="w-full h-64 bg-white-bg border border-black/10"
              />
            ))}
          {productList?.length === 0 && !isLoading && (
            <p className="text-sm md:text-base text-gray-700 font-semibold whitespace-nowrap">
              商品がありません。
            </p>
          )}
        </div>
        <div className="my-10">
          <TitleText
            title="HOW TO USE"
            subtitle="使い方"
            className="text-[#786464]"
          />
          <ExomereDailyComponent />
          <ExomereSpecialComponent />
        </div>
      </div>
    </PublicDetailsLayout>
  );
};