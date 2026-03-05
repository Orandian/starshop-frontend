"use client";

interface StepIndicatorProps {
  step: number;
  disabled?: boolean;
}

const StepIndicator = ({ step, disabled = false }: StepIndicatorProps) => {
  const linkClass = (stepNum: number) =>
    `bg-disabled/10 relative ${stepNum === 3 ? "" : "flex-1 h-0.5"} 
     ${disabled ? "pointer-events-none opacity-50" : ""}`;

  return (
    <div className="my-10 w-2/3 mx-auto">
      <div className="flex items-center gap-6">
        <div  className={linkClass(1)}>
          <div className="absolute -left-6 top-[-22px]">
            <div
              className={`size-10 rounded-full ${step === 1 ? "bg-black" : "bg-disabled/80"} text-white flex items-center justify-center`}
            >
              1
            </div>
            <div className="text-xs text-center mt-2">カート</div>
          </div>
        </div>
        <div  className={linkClass(2)}>
          <div className="absolute -left-6 top-[-22px]">
            <div
              className={`size-10 rounded-full ${step === 2 ? "bg-black" : "bg-disabled/80"} text-white flex items-center justify-center`}
            >
              2
            </div>
            <div className="text-xs text-center mt-2">配送先</div>
          </div>
        </div>
        <div  className={linkClass(3)}>
          <div className="absolute -left-6 top-[-22px]">
            <div
              className={`size-10 rounded-full ${step === 3 ? "bg-black" : "bg-disabled/80"} text-white flex items-center justify-center`}
            >
              3
            </div>
            <div className="text-xs text-center mt-2 break-keep ">お支払い</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
