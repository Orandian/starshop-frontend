"use client";

import TitleWithNavigationComponent from "@/components/app/public/TitleWithNavigationComponent";
import ComponentLayout from "@/components/layouts/ComponentLayout";
import TitleImage from "@/public/svgs/text/Products.svg";
import { useState } from "react";

const NavigationTitlePage = () => {
  const [selectedOption, setSelectedOption] = useState("all");
  const options = [
    {
      label: "All Products",
      value: "all",
    },
    {
      label: "New Arrivals",
      value: "new",
    },
    {
      label: "Best Sellers",
      value: "best",
    },
    {
      label: "On Sale",
      value: "sale",
    },
  ];
  return (
    <ComponentLayout
      componentTitle="Navigation Title"
      componentPath="@/components/app/public/TitleWithNavigationComponent.tsx"
      params={TitleWithNavigationComponent.Params}
    >
      <div className="flex-col gap-10">
        <TitleWithNavigationComponent
          titleImage={TitleImage}
          title="All Products"
          handleToClick={() => {}}
        />
        <TitleWithNavigationComponent
          titleImage={TitleImage}
          title="All Products"
          handleToClick={() => {}}
          options={options}
          selectedOption={selectedOption}
          handleToSelect={(value) => setSelectedOption(value)}
        />
      </div>
    </ComponentLayout>
  );
};

export default NavigationTitlePage;
