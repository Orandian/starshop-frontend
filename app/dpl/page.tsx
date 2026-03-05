"use client";
import TitleText from "@/components/app/TitleText";
import PublicDetailsLayout from "@/components/layouts/PublicDetailsLayout";
import DplDailyComponent from "@/components/app/public/daily/DplDailyComponent";
import DplSpecialComponent from "@/components/app/public/special/DplSpecialComponent";
import ProductBoxWithoutBrandTitleComponent from "@/components/app/public/ProductBoxWithoutBrandTitleComponent";
import { usePublicProductsList } from "@/hooks/user/useProduct";
import { Product } from "@/types/dashboard/products";
import { useEffect } from "react";
import { toast } from "sonner";
import { getPublicUrl } from "@/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function DPLPage() {
  const { data: products, isError, error ,isLoading } = usePublicProductsList("D.PL Cell");
  const productList = (products?.data?.data ?? []) as Product[];
  useEffect(() => {
    if (isError) {
      toast.error(error?.message);
    }
  }, [isError, error]);
  
  return (
    <PublicDetailsLayout>
      <div className="px-4 md:px-0">
        <h1 className="text-3xl font-bold font-cormorant text-center mb-8 text-[#786464]">
          D.PL Cell
        </h1>
        <p className="text-center text-sm md:text-base text-gray-700">
          乾燥やたるみ、年齢肌のゆらぎに悩むあなたへ ―{" "}
          <br className="md:hidden" />
          次世代エイジングケアとして肌の土台から整える
          <br className="md:hidden" />
          D.PL Cell（ディプルセル）。
          <br />
          自然由来成分と先端美容技術で、
          <br className="md:hidden" />
          ふっくら弾力のあるシルク肌へ導きます。
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 my-10 md:my-24">
          {productList?.map((item: Product) => (
            <ProductBoxWithoutBrandTitleComponent key={item.productId}
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
                  name: item.brandName || "D.PL Cell",
                },
                price: item.tax
                  ? item.salePrice + (item.salePrice * item.tax) / 100
                  : item.salePrice,
                isTax: !!item.tax,
                rank: 0,
              }} />
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
          <DplDailyComponent />
          <DplSpecialComponent />
        </div>
      </div>
    </PublicDetailsLayout>
  );
};