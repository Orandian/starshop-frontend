import React from "react";
import ComponentsNavigator from "@/components/navigators/ComponentsNavigator";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex-row gap-10 h-screen w-screen overflow-y-auto">
      <ComponentsNavigator />
      {children}
    </div>
  );
};

export default layout;
