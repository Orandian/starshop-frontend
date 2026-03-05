"use client";

import ComponentLayout from "@/components/layouts/ComponentLayout";
import DashboardCardComponent from "@/components/admin/DashboardCardComponent";

const DashboardCardPage = () => {
  return (
    <ComponentLayout
      componentTitle="Dashboard Card"
      componentPath="@/components/admin/DashboardCardComponent.tsx"
      params={DashboardCardComponent.Params}
    >
      <div className="flex-row-center gap-5">
        <DashboardCardComponent
          value={150000}
          description="今月売上"
          isCurrency
        />
        <DashboardCardComponent
          value={1895000}
          description="年間売上"
          isCurrency
        />
        <DashboardCardComponent
          value={52}
          description="販売中の商品"
        />
        <DashboardCardComponent
          value={150}
          description="お客様数"
        />
        <DashboardCardComponent
          value={653}
          description="注文数"
        />
      </div>
    </ComponentLayout>
  );
};

export default DashboardCardPage;
