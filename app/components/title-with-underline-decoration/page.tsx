"use client";

import ComponentLayout from "@/components/layouts/ComponentLayout";
import TitleWithUnderlineDecorationComponent from "@/components/app/public/TitleWithUnderlineDecorationComponent";

const TitleWithUnderlineDecorationPage = () => {
  return (
    <ComponentLayout
      componentTitle="Title with Underline Decoration"
      componentPath="@/components/app/public/TitleWithUnderlineDecorationComponent.tsx"
      params={TitleWithUnderlineDecorationComponent.Params}
    >
      <TitleWithUnderlineDecorationComponent title="概要" />
      <TitleWithUnderlineDecorationComponent title="新着商品" />
      <TitleWithUnderlineDecorationComponent title="人気商品" />
    </ComponentLayout>
  );
};

export default TitleWithUnderlineDecorationPage;
