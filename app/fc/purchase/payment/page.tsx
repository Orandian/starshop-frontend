"use client";

import StepIndicator from "@/components/fc/purchase/StepIndicator";
import FCPaymentForm from "@/components/fc/stripe/FCPaymentForm";
import { decryptString } from "@/utils";
import { useRouter, useSearchParams } from "next/navigation";

const FCPaymentPage = () => {
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get("orderId");
  const cartSubscriptIdParams = searchParams.get("cartSubscriptId");
  const pdfUrlParam = searchParams.get("pdfUrl");
  const orderId = decryptString(orderIdParam as string);
  const cartSubscriptId = decryptString(cartSubscriptIdParams as string);
  const sessionId = searchParams.get("session_id");
  const sub = searchParams.get("sub");
  const router = useRouter();

  // if (isLoading) {
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <p>Loading...</p>
  //     </div>
  //   );
  // }

  return (
    <section className="w-full">
      <div className="w-full px-8 py-6 bg-white card-border border-0 rounded-[10px] shadow-[0_0_15px_0_rgba(0,0,0,0.1)]">
        {/* Step indicator */}
        <StepIndicator step={3} disabled={(sessionId || sub) ? true : false} />

        <FCPaymentForm
          sessionId={sessionId}
          sub={sub}
          backPath="/fc/purchase/delivery"
          orderId={orderId}
          cartSubscriptId={cartSubscriptId ? Number(cartSubscriptId) : undefined}
          returnUrl="/fc/purchase/payment"
          transactionType={2}
          pdfUrl={pdfUrlParam}
          successClick={() => router.push("/fc/purchase")}
          failureClick={() => router.push("/fc/purchase/delivery")}
        />
      </div>
    </section>
  );
};

export default FCPaymentPage;
