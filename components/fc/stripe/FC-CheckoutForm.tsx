"use client";

import {
  useFcCheckoutIntent,
  useFcSubscriptionIntent,
} from "@/hooks/fc/useFcPayment";
import { useUserStore } from "@/store/useAuthStore";
import { FCCheckoutIntentRequest, FCCheckoutIntentResponse } from "@/types/fc";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useMemo, useState } from "react";

interface FCCheckoutFormProps {
  cartData: FCCheckoutIntentRequest;
  pdfUrl?: string | null;
}

const FCCheckoutForm = ({ cartData, pdfUrl }: FCCheckoutFormProps) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [publishableKey, setPublishableKey] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(true);
  const { mutateAsync: createCheckoutIntent } = useFcCheckoutIntent();
  const { mutateAsync: createSubscriptionIntent } = useFcSubscriptionIntent();
  const { user } = useUserStore();

  const stripePromise = useMemo(() => {
    if (publishableKey) {
      return loadStripe(publishableKey);
    }
    return null;
  }, [publishableKey]);

  const getClientSecret = async () => {
    try {
      //decode pdfUrl
      const decodedPdfUrl = decodeURIComponent(pdfUrl || "");
      // Add pdfUrl to cartData
      const updatedCartData = {
        ...cartData,
        pdfKey: decodedPdfUrl,
      };
      let response: FCCheckoutIntentResponse;
      if (updatedCartData.cartSubscriptId) {
        response = await createSubscriptionIntent({
          cartSubscriptId: updatedCartData.cartSubscriptId,
          returnUrl: updatedCartData.returnUrl,
          userId: user?.userId as number,
        });
      }else if (updatedCartData.orderId) {
        response = await createCheckoutIntent(updatedCartData);
      }else{
        throw new Error("No valid cart subscription or order ID found");
      }
      if (isMounted) {
        setPublishableKey(response.publicKey);
        setClientSecret(response.clientSecret);
      }
    } catch (error) {
      console.error("Error creating checkout intent:", error);
      // Handle error appropriately
    }
  };

  useEffect(() => {
    if (user?.userId && cartData.cart?.products?.length > 0) {
      getClientSecret();
    }

    return () => {
      setIsMounted(false); // Use setter instead of direct assignment
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, cartData, pdfUrl]);

  if (!publishableKey) {
    return (
      <div className="flex flex-col justify-center items-center h-[300px] space-y-4">
        <p>決済システムを初期化中...</p>
        <div className="w-8 h-8 border-4 border-blue-200 rounded-full border-t-blue-600 animate-spin"></div>
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] p-4 text-center">
        <p className="text-red-500 font-medium">
          決済システムを初期化できません
        </p>
        <p className="text-sm text-gray-600 mt-2">
          {publishableKey
            ? "公開キーが正しく取得できませんでした"
            : "公開キーが設定されていません"}
        </p>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <p>読み込み中...</p>
      </div>
    );
  }

  return (
    <div id="fc-checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ fetchClientSecret: () => Promise.resolve(clientSecret) }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

export default FCCheckoutForm;
