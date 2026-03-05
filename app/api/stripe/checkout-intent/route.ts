"use server";

import { stripe } from "@/lib/stripe";
import { CartProduct } from "@/types/cart";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { cart, billingAddressId, shippingAddressId } = await req.json();

    const products = cart.products || [];
    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: "カートに商品が存在しません。" },
        { status: 400 }
      );
    }

    const line_items = products.map((product: CartProduct) => ({
      price_data: {
        currency: "jpy",
        product_data: {
          name: product.product_name,
          images: [product.product_images?.[0] || ""],
        },
        unit_amount: Math.round(product.sale_price),
      },
      quantity: product.quantity,
    }));

    if (cart.tax_eight) {
      line_items.push({
        price_data: {
          currency: "jpy",
          product_data: { name: "税金 (8%)", images: [] },
          unit_amount: Math.round(cart.tax_eight),
        },
        quantity: 1,
      });
    }

    if (cart.tax_ten) {
      line_items.push({
        price_data: {
          currency: "jpy",
          product_data: { name: "税金 (10%)", images: [] },
          unit_amount: Math.round(cart.tax_ten),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      mode: "payment",
      payment_method_types: ["card"],
      locale: "ja",
      line_items,
      metadata: {
        user_id: cart.user_id?.toString() || "",
        cart_id: cart.cart_id?.toString() || "",
        shipping_address_id: shippingAddressId?.toString() || "",
        billing_address_id: billingAddressId?.toString() || "",
      },
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (err) {
    console.error("Stripe session error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
