"use client";

import CartCardComponent from "@/components/app/CartCardComponent";
import StepProgressComponent from "@/components/app/public/StepProgressComponent";
import PublicDetailsLayout from "@/components/layouts/PublicDetailsLayout";
import { useState } from "react";
import CartSectionOneComponent from "@/components/cart/CartSectionOneComponent";
import CartSectionTwoComponent from "@/components/cart/CartSectionTwoComponent";
import CartSectionThreeComponent from "@/components/cart/CartSectionThreeComponent";
import PublicLayout from "@/components/layouts/PublicLayout";

const CartPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [billingAddressId, setBillingAddressId] = useState<number | null>(null);
  const [shippingAddressId, setShippingAddressId] = useState<number | null>(
    null
  );
  const [shippingAddressCity, setShippingAddressCity] = useState<string | null>(null);

  if (billingAddressId || shippingAddressId) {
  }
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

  const handleToNextStep = () => {
    if (currentStep === steps.length - 1) {
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handleToPreviousStep = () => {
    if (currentStep === 0) {
      return;
    }
    setCurrentStep(currentStep - 1);
  };

  return (
    <PublicLayout>
      <PublicDetailsLayout>
        <div className="px-0 md:px-4">
          <CartCardComponent>
            <div className="w-full flex justify-center">
              <StepProgressComponent
                steps={steps}
                currentStep={currentStep}
                className="w-full md:w-[60%]"
              />
            </div>

            {currentStep === 0 && (
              <CartSectionOneComponent handleToUpdateCart={handleToNextStep} />
            )}
            {currentStep === 1 && (
              <CartSectionTwoComponent
                handleToPreviousStep={handleToPreviousStep}
                handleToNextStep={handleToNextStep}
                setBillingAddressId={setBillingAddressId}
                setShippingAddressId={setShippingAddressId}
                setShippingAddressCity={setShippingAddressCity}
              />
            )}
            {currentStep === 2 && (
              <CartSectionThreeComponent
                // billingAddressId={billingAddressId || 0}
                // shippingAddressId={shippingAddressId || 0}
                shippingAddressCity={shippingAddressCity || ""}
                handleToPreviousStep={handleToPreviousStep}
              />
            )}
          </CartCardComponent>
        </div>
      </PublicDetailsLayout>
    </PublicLayout>
  );
};

export default CartPage;
