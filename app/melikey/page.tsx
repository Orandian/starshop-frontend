"use client";
// import TitleText from "@/components/app/TitleText";
import PublicDetailsLayout from "@/components/layouts/PublicDetailsLayout";
// import DplDailyComponent from "@/components/app/public/daily/DplDailyComponent";
// import DplSpecialComponent from "@/components/app/public/special/DplSpecialComponent";
// import ProductBoxWithoutBrandTitleComponent from "@/components/app/public/ProductBoxWithoutBrandTitleComponent";
// import { usePublicProductsList } from "@/hooks/user/useProduct";
// import { Product } from "@/types/dashboard/products";
// import { useEffect } from "react";
// import { toast } from "sonner";

export default function MelikeyPage() {
    // const { data: products, isError, error } = usePublicProductsList("2");
    // const productList = (products?.data?.data ?? []) as Product[];
    // useEffect(() => {
    //     if (isError) {
    //         toast.error(error?.message);
    //     }
    // }, [isError, error]);

    return (
        <PublicDetailsLayout>
            <div className="px-4 md:px-0">
                <h1 className="text-3xl font-bold font-cormorant text-center mb-8 text-[#786464]">
                    ミライキー
                </h1>
                <p className="text-center text-sm md:text-base text-gray-700">
                    OEM製品を開発中です。詳細はお問い合わせください。
                </p>
                
            </div>
        </PublicDetailsLayout>
    );
};