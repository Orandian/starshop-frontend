"use client";

import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { useState, useEffect, useMemo } from "react";
// import { useUpdateClientSecret } from "@/hooks/user/useStripe";
import { useUserStore } from "@/store/useAuthStore";
import { useUserCheckoutIntent } from "@/hooks/user/useOrder";
import { Cart } from "@/types/fc";

const Checkout = ({ cart, pdfUrl }: { cart: Cart; pdfUrl?: string }) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [publishableKey, setPublishableKey] = useState<string | null>(null);

  const { mutateAsync: createCheckoutIntent } = useUserCheckoutIntent();
  const { user } = useUserStore();

  const stripePromise = useMemo(() => {
    if (publishableKey) {
      return loadStripe(publishableKey);
    }
    return null;
  }, [publishableKey]);

  const getClientSecret = async () => {
    try {
      const payload = {
        cart,
        returnUrl: "/return",
        pdfKey: pdfUrl,
      };

      const response = await createCheckoutIntent(payload);
      setPublishableKey(response.publicKey);
      setClientSecret(response.clientSecret);
    } catch (error) {
      console.error("Error creating checkout intent:", error);
      // Handle error appropriately
    }
  };

  useEffect(() => {
    if (user && cart.products && cart.products.length > 0) {
      getClientSecret();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, cart]);

  if (!clientSecret)
    return (
      <div className="flex justify-center items-center h-[300px]">
        <p>読み込み中...</p>
      </div>
    );
  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ fetchClientSecret: () => Promise.resolve(clientSecret) }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

export default Checkout;
