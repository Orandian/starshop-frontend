"use client";
import SalesChart from "@/components/fc/my-page/SalesChart";
import TransactionDetails from "@/components/fc/mystatus/TransactionDetails";
import { useFullUserDetail } from "@/hooks/fc/useFullUserDetail";
import { useEffect } from "react";

const Mystatus = () => {
  const { userDetail } = useFullUserDetail();

  useEffect(() => {
    if (userDetail?.data && userDetail.data.role === 1) {
      window.location.href = "/fc/mypage";
    }
  }, [userDetail?.data]);

  return (
    <div className="w-full  ">
      <div className="w-full px-4 md:px-8 py-4 bg-white card-border border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)] h-auto">
        <div className="flex justify-between items-center mb-5">
          <h2 className="my-4 font-bold">私のステータス</h2>
        </div>

        <div className="flex">
          <SalesChart />
        </div>

        <TransactionDetails />
      </div>
    </div>
  );
};

export default Mystatus;
