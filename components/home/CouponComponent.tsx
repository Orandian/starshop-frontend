import SectionLayout from "@/components/layouts/SectionLayout";
import React from "react";
import Image from "next/image";
import TitleText from "../app/TitleText";
import { usePublicCouponList } from "@/hooks/user/useProduct";
import { Coupon } from "@/types/coupons";
import { getPublicUrl } from "@/utils";

const CouponComponent = () => {
  const { data: coupons } = usePublicCouponList();
  const couponsList = (coupons?.data ?? []) as Coupon[];

  return (
    <SectionLayout className="my-14 md:my-28 h-auto">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <TitleText title="Coupon" subtitle="クーポン" className="text-[#786464]" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {couponsList?.length > 0 &&
            couponsList?.map((coupon) => (
              <div key={coupon?.couponId} className="w-full">
                {coupon?.image ? (
                  <div className="w-full h-full max-h-[300px] flex items-center justify-center border border-gray-200 bg-white-bg bg-contain">
                    <Image
                      src={getPublicUrl(coupon?.image || "")}
                      alt={`Coupon ${coupon?.couponId}`}
                      width={300}
                      height={300}
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="hidden md:flex items-center justify-center w-full h-full max-h-[300px] border border-gray-200 bg-white-bg bg-contain">
                    <span className="text-gray-400 text-lg font-medium">
                      Coming Soon!
                    </span>
                  </div>
                )}
              </div>
            ))}
        </div>
        {couponsList?.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm md:text-base text-gray-400 font-semibold whitespace-nowrap">
              クーポンはまだありません。    
            </p>
          </div>
        )}
      </div>
    </SectionLayout>
  );
};

export default CouponComponent;
