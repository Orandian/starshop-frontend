"use client";

import ComponentLayout from "@/components/layouts/ComponentLayout";
import NewsCardComponent from "@/components/app/public/NewsCardComponent";

const NewsCardPage = () => {
  return (
    <ComponentLayout
      componentTitle="News Card"
      componentPath="@/components/app/public/NewsCardComponent.tsx"
      params={NewsCardComponent.Params}
    >
      <NewsCardComponent
        date="2024.10.01"
        title="中央区日本橋横山町 3-1 横山町ダイカンプラザ"
        handleClick={() => {}}
      />
    </ComponentLayout>
  );
};

export default NewsCardPage;
