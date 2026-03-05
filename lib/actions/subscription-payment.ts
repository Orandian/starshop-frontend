import { stripe } from "@/lib/stripe";
// import {
//   createRegularPurchaseCart,
//   createRegularPurchaseItems,
// } from "@/lib/api/user/regularPurchaseService";
import Stripe from "stripe";
// import { Order } from "@/types/orders";
// import { createOrder, createOrderItem } from "@/lib/api/user/orderService";
// import { PaymentRequest } from "@/types/payments";
// import { createPaymentIntent } from "@/lib/api/user/paymentService";
// import { createOrderMail } from "@/lib/api/user/createOrderMailService";
// import { getSubscriptionCartItemsByCartId } from "@/lib/api/user/subScriptionService";

/**
 * Handle successful subscription
 * @param sessionId - Stripe session id
 * @returns success response
 */
export async function handleSuccessfulPayment(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: [
      "line_items.data.price.product",
      "subscription",
      "subscription.items.data.price",
    ],
  });

  const subscription = session.subscription as Stripe.Subscription;

  // const currentPeriodEnd = new Date(
  //   subscription.items.data[0].current_period_end * 1000
  // ).toISOString();

  const metadata = session.metadata;
  const user = metadata?.user_id;
  const shippingAddressId = metadata?.shipping_address_id;
  const billingAddressId = metadata?.billing_address_id;
  const purchaseTypeId = metadata?.subscription_interval;

  if (!user || !shippingAddressId || !billingAddressId || !purchaseTypeId) {
    throw new Error("Missing metadata from Stripe session.");
  }

  // const customerId = session.customer as string;

  // 1. Create Regular Purchase Cart
  // const regularCart = await createRegularPurchaseCart({
  //   user_id: user || "",
  //   purchase_type_id: Number(purchaseTypeId),
  //   stripe_subscription_id: subscription.id,
  //   stripe_customer_id: customerId,
  //   subscription_status: subscription.status,
  //   current_period_end: currentPeriodEnd,
  // });

  // 2. Create Regular Purchase Items
  // const regularItems = session.line_items?.data.map((item) => {
  //   const price = item.price as Stripe.Price;
  //   const localProductId = price.metadata?.local_product_id;

  //   const matchingSubItem = subscription.items.data.find(
  //     (subItem) => subItem.price.id === price.id
  //   );

  //   if (!localProductId) {
  //     return;
  //   }

  //   return {
  //     regular_purchase_cart_id: regularCart.regular_purchase_cart_id,
  //     product_id: Number(localProductId),
  //     quantity: Number(item.quantity),
  //     stripe_subscription_item_id: matchingSubItem?.id || "",
  //   };
  // });

  // await createRegularPurchaseItems(
  //   regularItems?.filter((item) => item !== undefined)
  // );

  // 3. Create Order
  // const orderData: Order = {
  //   total_amount: session.amount_total ?? 0,
  //   shipping_address_id: Number(shippingAddressId),
  //   billing_address_id: Number(billingAddressId),
  //   payment_method: session.payment_method_types?.[0] || "stripe",
  //   transaction_id: session.invoice as string,
  // };

  // const order = await createOrder(orderData, user);

  // 4. Create Payment Intent
  // const paymentRequest: PaymentRequest = {
  //   order_id: order.order_id,
  //   payment_date: new Date().toISOString(),
  //   amount: session.amount_total ?? 0,
  //   payment_method: session.payment_method_types?.[0] || "stripe",
  //   transaction_status: session.status || "pending",
  //   transaction_reference: session.invoice as string,
  // };

  // await createPaymentIntent(paymentRequest);

  // 5. Create Order Items
  // const orderItems = session.line_items?.data.map((item) => {
  //   const price = item.price as Stripe.Price;
  //   const localProductId = price.metadata?.local_product_id;

  //   if (!localProductId) {
  //     return;
  //   }

  //   return {
  //     order_id: order.order_id,
  //     product_id: Number(localProductId),
  //     quantity: Number(item.quantity),
  //     price_at_purchase: item?.price?.unit_amount || 0,
  //     subtotal: item.amount_subtotal,
  //   };
  // });

  // if (orderItems) {
  //   await createOrderItem(
  //     orderItems.filter(
  //       (item): item is NonNullable<typeof item> => item !== undefined
  //     )
  //   );
  // }

  // 3. Create order mail
  // const cartItems = await getSubscriptionCartItemsByCartId(
  //   Number(regularCart.regular_purchase_cart_id)
  // );

  // await createOrderMail({
  //   orderId: order.order_id,
  //   username:
  //     order.shippingData.recipient_first_name +
  //     " " +
  //     order.shippingData.recipient_last_name,
  //   total: session.amount_total ?? 0,
  //   products: cartItems.map((item: {
  //     products: { name: string; regular_discount: number; tax: number };
  //     quantity: number;
  //   }) => ({
  //     name: item.products.name,
  //     quantity: item.quantity,
  //     price: item.products.regular_discount,
  //     taxPrice: (item.products.tax / 100) * item.products.regular_discount,
  //   })),
  // });

  return { success: true, subscriptionId: subscription.id };
}
