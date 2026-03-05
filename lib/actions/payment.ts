"use server";

import { stripe } from "@/lib/stripe";
// import { createOrder } from '@/lib/api/user/orderService';
// import { getCartItemsByCartId } from '@/lib/api/user/cartService';
// import { Order } from "@/types/orders";
// import { PaymentRequest } from '@/types/payments';
// import { createPaymentIntent } from '@/lib/api/user/paymentService';
// import { createOrderMail } from '../api/user/createOrderMailService';

/**
 * Handle successful payment
 * @param sessionId - Session id
 * @returns Payment intent
 * @author ヤン
 */
export async function handleSuccessfulPayment(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items"],
  });

  const metadata = session.metadata;

  const userId = metadata?.user_id;
  const cartId = metadata?.cart_id;
  const shippingAddressId = metadata?.shipping_address_id;
  const billingAddressId = metadata?.billing_address_id;

  if (!userId || !cartId || !shippingAddressId || !billingAddressId) {
    throw new Error("Missing metadata from Stripe session.");
  }

  // 1. Create Order
  // const orderData: Order = {
  //   total_amount: session.amount_total ?? 0,
  //   shipping_address_id: Number(shippingAddressId),
  //   billing_address_id: Number(billingAddressId),
  //   payment_method: session.payment_method_types?.[0] || 'stripe',
  //   transaction_id: session.payment_intent as string,
  // };

  // const order = await createOrder(orderData, userId);

  // const paymentRequest: PaymentRequest = {
  //   order_id: order.order_id,
  //   payment_date: new Date().toISOString(),
  //   amount: session.amount_total ?? 0,
  //   payment_method: session.payment_method_types?.[0] || 'stripe',
  //   transaction_status: session.status || 'pending',
  //   transaction_reference: session.payment_intent as string,
  // };

  // 2. Create Payment Intent
  // await createPaymentIntent(paymentRequest);

  // 3. Re-fetch cart items from DB (or send from client in metadata if you prefer)
  // const cartItems = await getCartItemsByCartId(Number(cartId)); // must return product_id, quantity, sale_price

  // const orderItems: OrderItemCreate[] = cartItems.map((item) => ({
  //   order_id: order.order_id,
  //   product_id: item.product_id,
  //   quantity: item.quantity,
  //   price_at_purchase: item.products.sale_price,
  //   subtotal: item.products.sale_price * item.quantity,
  // }));

  // await createOrderItem(orderItems);

  // 3. Create order mail
  // await createOrderMail({
  //   orderId: order.order_id,
  //   username: order.shippingData.recipient_first_name + ' ' + order.shippingData.recipient_last_name,
  //   total: session.amount_total ?? 0,
  //   products: cartItems.map((item) => ({
  //     name: item.products.name,
  //     quantity: item.quantity,
  //     price: item.products.sale_price,
  //     taxPrice: item.products.tax / 100 * item.products.sale_price,
  //   })),
  // });

  // 4. Delete cart and cart items
  // await deleteCart(Number(cartId));

  return { success: true, orderId: 1 };
}
