import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { CartItem, SubscriptionProduct } from "@/types/cart";

/**
 * Update client secret
 * @param cart - Cart
 * @param billingAddressId - Billing address id
 * @param shippingAddressId - Shipping address id
 * @returns
 * @author ヤン
 */
export const useUpdateClientSecret = () => {
  return useMutation({
    mutationFn: async ({
      cart,
      billingAddressId,
      shippingAddressId,
    }: {
      cart: CartItem;
      billingAddressId: number;
      shippingAddressId: number;
    }) => {
      const res = await axios.post(
        "/api/stripe/checkout-intent",
        {
          cart,
          billingAddressId,
          shippingAddressId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return res.data.clientSecret;
    },
  });
};

/**
 * Update client secret
 * @param cart - Cart
 * @param billingAddressId - Billing address id
 * @param shippingAddressId - Shipping address id
 * @returns
 * @author ヤン
 */
export const useUpdateRegularClientSecret = () => {
  return useMutation({
    mutationFn: async ({
      user_id,
      subscriptionProducts,
      billingAddressId,
      shippingAddressId,
      monthInterval,
    }: {
      user_id: string | number;
      subscriptionProducts: SubscriptionProduct;
      billingAddressId: number;
      shippingAddressId: number;
      monthInterval: number;
    }) => {
      const res = await axios.post(
        "/api/stripe/regular-checkout-intent",
        {
          subscriptionProducts,
          billingAddressId,
          shippingAddressId,
          monthInterval,
          user_id
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return res.data.clientSecret;
    },
  });
};
