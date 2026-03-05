// components/fc/SalesChart.tsx
"use client";

import { usePlusPlan } from "@/hooks/fc";
import { useFullUserDetail } from "@/hooks/fc/useFullUserDetail";
import { cn } from "@/lib/utils";
import { AlarmClockCheck, Crown } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

// const data = [
//   { name: "残り", value: 45, color: "#A9957763", count: 18 },
//   { name: "現在", value: 35, color: "#A99577", count: 12 },
// ];

export default function SalesChart() {
  const { userDetail } = useFullUserDetail();
    const { data: plusPlan } = usePlusPlan();

  const {
    currentAmount = 10,
    remainingAmount = 10,
    remainingPercentage = 10,
    progressPercentage = 10,
    rankUpDaysLeft = 10,
  } = plusPlan?.data || {};
  
  const chartData = [
    {
      name: "残り",
      value: remainingAmount,
      color: "#A9957763",
      count: remainingPercentage,
    },
    {
      name: "現在",
      value: currentAmount,
      color: "#A99577",
      count: progressPercentage,
    },
  ];

  const changeShowCurrencyDigit = (value: string) => {
    const numValue = Number(value);
    if (numValue >= 10000) {
      return `${Math.floor(numValue / 10000)}万円`;
    } else if (numValue >= 1000) {
      return `${Math.floor(numValue / 1000)}千円`;
    } else {
      return `${numValue}円`;
    }
  };

  return (
    <div className="w-full  bg-white">
      {userDetail?.data?.showRank && (
        <div className="w-full flex justify-end items-center">
          {/* <h3 className="text-lg font-semibold mb-6">ランクアップ</h3> */}
          <button className="bg-sidebar-primary text-white px-4 py-2 flex items-center gap-2 rounded-[10px] mb-4 md:mb-0">
            <AlarmClockCheck />
            <p className="text-secondary">
              ランクアップまで残り {rankUpDaysLeft}日
            </p>
          </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 2xl:gap-12 items-center">
        <div
          className={cn(
            "bg-foreground w-full  rounded-lg p-6 flex flex-col items-center text-center shadow-sm",
            userDetail?.data?.showRank ? "lg:w-1/4" : "lg:w-full"
          )}
        >
          <h3 className="text-secondary font-bold mb-1">私のステータス</h3>
          <p className="text-sm my-5">
              {userDetail?.data?.currentPlan.fcPlanMasterId === 1 ||
              userDetail?.data?.currentPlan.fcPlanMasterId === 2
                ? userDetail?.data?.currentPlan.planName
                : "上級パートナーコース"}
          </p>
          <Crown className="text-yellow-500" size={36} />
        </div>

        {userDetail?.data?.showRank && (
          <>
            <div className="w-full lg:w-3/5 xl:-w-2/5 2xl:w-1/3">
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={120}
                      paddingAngle={0}
                      dataKey="value"
                      label={({
                        name,
                        cx,
                        cy,
                        midAngle,
                        innerRadius,
                        outerRadius,
                        value,
                      }) => {
                        const RADIAN = Math.PI / 180;
                        // Calculate the middle point of the segment's arc
                        const middleRadius =
                          innerRadius + (outerRadius - innerRadius) * 0.5; // Adjusted to 70% for better centering
                        const angle = -midAngle * RADIAN;
                        // Adjust the position based on the angle to keep text properly centered
                        const x = cx + Math.cos(angle) * middleRadius;
                        const y = cy + Math.sin(angle) * middleRadius; // Slight vertical adjustment

                        return (
                          <text
                            x={x}
                            y={y}
                            fill="black"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="text-xs font-bold"
                          >
                            <tspan x={x} dy="-0.3em" display="block">
                              {name}
                            </tspan>
                            <tspan
                              x={x}
                              dy="1.2em"
                              display="block"
                              style={{ fontWeight: "bold" }}
                            >
                              {changeShowCurrencyDigit(value)}
                            </tspan>
                          </text>
                        );
                      }}
                      labelLine={false}
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          stroke="none"
                        />
                      ))}
                    </Pie>
                    {/* <Tooltip /> */}
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="w-full lg:w-2/3 flex flex-col items-start justify-center ">
              {/* Flex container for the two boxes and the arrow */}
              <div className="flex flex-col xl:flex-row items-center gap-4  w-full">
                {/* Box 1: Current Status */}
                <div className="bg-product-card-btn text-white p-4 px-10  w-full xl:w-auto ">
                  <div className="flex justify-between gap-6 mb-2">
                    <span className="text-sm font-bold">現在のランク</span>
                    <span className="font-medium whitespace-nowrap">
                      10万円 (60%仕入)
                    </span>
                  </div>
                  <div className="flex justify-between gap-6">
                    <span className="text-sm font-bold">現在の購入</span>
                    <span className="font-medium whitespace-nowrap">
                      {changeShowCurrencyDigit(currentAmount.toString())}
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                {/* Rotates on mobile (flex-col) and points right on desktop (flex-row) */}
                <div className="text-2xl font-bold text-gray-600 rotate-90 xl:rotate-0">
                  &rarr;
                </div>

                {/* Box 2: Rank Up Status */}
                <div className="bg-gray-300 text-gray-900 p-4 px-10 w-full xl:w-auto">
                  <div className="flex justify-between gap-6 mb-2">
                    <span className="text-sm font-bold">ランクアップ</span>
                    <span className="font-medium whitespace-nowrap">
                      30万円 (80%仕入)
                    </span>
                  </div>
                  <div className="flex justify-between gap-6">
                    <span className="text-sm font-bold">残りの金額</span>
                    <span className="font-medium whitespace-nowrap">
                      {changeShowCurrencyDigit(remainingAmount.toString())}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
