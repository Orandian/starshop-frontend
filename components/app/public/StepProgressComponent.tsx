"use client";

import { cn } from "@/lib/utils";

interface Step {
  label: string;
}

interface StepProgressProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

const StepProgressComponent = ({ steps, currentStep, className }: StepProgressProps) => {
  const progressPercentage = ((currentStep) / (steps.length - 1)) * 100;

  return (
    <div className={cn("relative w-full flex justify-between items-center", className)}>
      <div className="absolute top-1/2 transform -translate-y-1/2 left-0 w-full h-1 bg-white-bg z-0" />

      <div
        className="absolute top-1/2 transform -translate-y-1/2 left-0 h-1 bg-primary z-0 transition-all duration-300"
        style={{ width: `calc(${progressPercentage}% - 1px)` }}
      />

      {steps.map((step, index) => (
        <div key={index} className="flex flex-col items-center z-10 relative">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              index <= currentStep
                ? "bg-primary text-white"
                : "bg-dark-bg text-dark"
            )}
          >
            {index + 1}
          </div>
          <p className="text-normal text-dark mt-2 absolute top-full whitespace-nowrap">{step.label}</p>
        </div>
      ))}
    </div>
  );
};

StepProgressComponent.Params = [
  {
    name: "steps",
    type: "{ label: string }[]",
  },
  {
    name: "currentStep",
    type: "number",
  },
  {
    name: "className?",
    type: "string",
  },
];

export default StepProgressComponent;
