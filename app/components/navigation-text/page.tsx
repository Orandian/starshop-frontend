"use client"

import NavigationTextComponent from "@/components/app/public/NavigationTextComponent";
import ComponentLayout from "@/components/layouts/ComponentLayout";

const NavigationTextPage = () => {
  return (
    <ComponentLayout
      componentTitle="Navigation Text"
      componentPath="@/components/app/public/NavigationTextComponent.tsx"
      params={NavigationTextComponent.Params}
    >
      <NavigationTextComponent
        text="パスワード忘れた方はこちら"
        handleNavigation={() => {}}
      />

      <NavigationTextComponent
        text="アカウント作成"
        handleNavigation={() => {}}
      />
    </ComponentLayout>
  );
};

export default NavigationTextPage;
