"use client";

import BadgeComponent from "@/components/app/public/BadgeComponent";
import ComponentLayout from "@/components/layouts/ComponentLayout";

const BadgePage = () => {
  return (
    <ComponentLayout
      componentTitle="Badge"
      componentPath="@/components/app/public/BadgeComponent.tsx"
      params={BadgeComponent.Params}
    >
      <BadgeComponent label="In Stock" />
      <BadgeComponent label="Out of Stock" />
      <BadgeComponent label="New" />
      <BadgeComponent label="Best Seller" />
      <BadgeComponent label="Sale" />
    </ComponentLayout>
  );
};

export default BadgePage;
