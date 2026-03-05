"use client";

import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { useState, useEffect } from "react";
import { useUpdateRegularClientSecret } from "@/hooks/user/useStripe";
import { SubscriptionProduct } from "@/types/cart";
import { useUserStore } from "@/store/useAuthStore";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!publishableKey) {
  console.error("Stripe publishable key is missing");
}

const stripePromise = loadStripe(publishableKey || "");

const Checkout = ({
  subscriptionProducts,
  billingAddressId,
  shippingAddressId,
  monthInterval,
}: {
  subscriptionProducts: SubscriptionProduct;
  billingAddressId: number;
  shippingAddressId: number;
  monthInterval: number;
}) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const { mutateAsync: updateClientSecret } = useUpdateRegularClientSecret();
  const { user } = useUserStore();

  const getSecret = async () => {
    const secret = await updateClientSecret({
      user_id: user?.userId || "",
      subscriptionProducts,
      billingAddressId,
      shippingAddressId,
      monthInterval,
    });
    setClientSecret(secret);
  };

  useEffect(() => {
    getSecret();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
