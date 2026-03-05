"use client";

import ComponentLayout from "@/components/layouts/ComponentLayout";
import ChartComponent from "@/components/admin/ChartComponent";

const ChartPage = () => {


  const chartData = [
    { date: "2025/04/01", thisMonth: 700, lastMonth: 130 },
    { date: "2025/04/02", thisMonth: 97, lastMonth: 180 },
    { date: "2025/04/03", thisMonth: 167, lastMonth: 120 },
    { date: "2025/04/04", thisMonth: 242, lastMonth: 260 },
    { date: "2025/04/05", thisMonth: 373, lastMonth: 290 },
    { date: "2025/04/06", thisMonth: 301, lastMonth: 340 },
    { date: "2025/04/07", thisMonth: 245, lastMonth: 180 },
    { date: "2025/04/08", thisMonth: 409, lastMonth: 320 },
    { date: "2025/04/09", thisMonth: 59, lastMonth: 110 },
    { date: "2025/04/10", thisMonth: 261, lastMonth: 190 },
    { date: "2025/04/11", thisMonth: 327, lastMonth: 350 },
    { date: "2025/04/12", thisMonth: 292, lastMonth: 210 },
    { date: "2025/04/13", thisMonth: 342, lastMonth: 380 },
    { date: "2025/04/14", thisMonth: 137, lastMonth: 220 },
    { date: "2025/04/15", thisMonth: 120, lastMonth: 170 },
    { date: "2025/04/16", thisMonth: 138, lastMonth: 190 },
    { date: "2025/04/17", thisMonth: 446, lastMonth: 360 },
    { date: "2025/04/18", thisMonth: 364, lastMonth: 410 },
    { date: "2025/04/19", thisMonth: 243, lastMonth: 180 },
    { date: "2025/04/20", thisMonth: 89, lastMonth: 150 },
    { date: "2025/04/21", thisMonth: 137, lastMonth: 200 },
    { date: "2025/04/22", thisMonth: 224, lastMonth: 170 },
  ]

  return (
    <ComponentLayout
      componentTitle="Chart"
      componentPath="@/components/admin/ChartComponent.tsx"
      params={ChartComponent.Params}
    >
      <div className="min-w-[1000px]">
        <ChartComponent
          chartData={chartData.map((item) => ({
            date: item.date,
            current: item.thisMonth,
            last: item.lastMonth,
          }))}
        />
      </div>
    </ComponentLayout>
  );
};

export default ChartPage;
