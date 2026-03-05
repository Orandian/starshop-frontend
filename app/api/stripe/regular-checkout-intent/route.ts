"use server";

import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {
      subscriptionProducts,
      billingAddressId,
      shippingAddressId,
      monthInterval,
      user_id,
    } = await req.json();

    const products = subscriptionProducts.products || [];
    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: "カートに商品が存在しません。" },
        { status: 400 }
      );
    }

    if (!monthInterval || ![1, 2, 3].includes(Number(monthInterval))) {
      return NextResponse.json(
        { error: "正しい月のインターバルを指定してください (1, 2, 3)." },
        { status: 400 }
      );
    }

    const line_items = [];

    // Add regular products
    for (const product of products) {
      const stripeProduct = await stripe.products.create({
        name: product.name,
        images: [product.images?.[0].imageUrl || ""],
        metadata: {
          local_product_id: product.productId?.toString(),
        },
      });

      const stripePrice = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: Math.round(product.subscriptDiscountSalePrice),
        currency: "jpy",
        recurring: {
          interval: "month",
          interval_count: monthInterval,
        },
        metadata: {
          local_product_id: product.productId?.toString(),
        },
      });

      line_items.push({
        price: stripePrice.id,
        quantity: product.quantity,
      });
    }

    // Add tax as a recurring product if needed
    if (subscriptionProducts.tax_eight) {
      const taxProduct = await stripe.products.create({
        name: "税金 (8%)",
        images: [],
      });

      const taxPrice = await stripe.prices.create({
        product: taxProduct.id,
        unit_amount: Math.round(subscriptionProducts.tax_eight),
        currency: "jpy",
        recurring: {
          interval: "month",
          interval_count: monthInterval,
        },
      });

      line_items.push({
        price: taxPrice.id,
        quantity: 1,
      });
    }

    if (subscriptionProducts.tax_ten) {
      const taxProduct = await stripe.products.create({
        name: "税金 (10%)",
        images: [],
      });

      const taxPrice = await stripe.prices.create({
        product: taxProduct.id,
        unit_amount: Math.round(subscriptionProducts.tax_ten),
        currency: "jpy",
        recurring: {
          interval: "month",
          interval_count: monthInterval,
        },
      });

      line_items.push({
        price: taxPrice.id,
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      mode: "subscription",
      payment_method_types: ["card"],
      locale: "ja",
      line_items,
      metadata: {
        shipping_address_id: shippingAddressId?.toString() || "",
        billing_address_id: billingAddressId?.toString() || "",
        subscription_interval: monthInterval,
        user_id: user_id || "",
      },
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription-return?session_id={CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (err) {
    console.error("Stripe subscription session error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

