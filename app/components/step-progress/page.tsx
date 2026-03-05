"use client";

import ComponentLayout from "@/components/layouts/ComponentLayout";
import StepProgressComponent from "@/components/app/public/StepProgressComponent";

const StepProgressPage = () => {
  const steps = [
    {
      label: "カート",
    },
    {
      label: "配送先",
    },
    {
      label: "支払い",
    },
  ];
  return (
    <ComponentLayout
      componentTitle="Step Progress"
      componentPath="@/components/app/public/StepProgressComponent.tsx"
      params={StepProgressComponent.Params}
    >
      <div className="space-y-20">
        <StepProgressComponent steps={steps} currentStep={0} />

        <StepProgressComponent steps={steps} currentStep={1} />

        <StepProgressComponent steps={steps} currentStep={2} />
      </div>
    </ComponentLayout>
  );
};

export default StepProgressPage;
