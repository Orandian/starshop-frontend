"use server";

import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
});

/**
 * Cancel subscription
 * @param req - Request object
 * @returns
 * @author ヤン
 */
export async function DELETE(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return errorResponse(
      MESSAGES.COMMON.USER_NOT_AUTHENTICATED,
      MESSAGES.COMMON.USER_NOT_AUTHENTICATED,
      401
    );
  }

  const body = await req.json();
  const { subscriptionId, stripeSubscriptionId, stripeCustomerId } = body;

  if (!subscriptionId || !stripeSubscriptionId || !stripeCustomerId) {
    return errorResponse(
      MESSAGES.COMMON.INVALID_REQUEST,
      MESSAGES.COMMON.INVALID_REQUEST,
      400
    );
  }

  const subscription = await stripe.subscriptions.cancel(stripeSubscriptionId);

  let stripeStatus = subscription.status;
  const isCanceledScheduled = subscription.cancel_at_period_end;

  if (isCanceledScheduled && stripeStatus === "active") {
    stripeStatus = "canceled";
  }

  // Now update in DB
  const { error } = await supabase
    .from("regular_purchase_carts")
    .update({ subscription_status: stripeStatus })
    .eq("stripe_subscription_id", stripeSubscriptionId);

  if (error) {
    return errorResponse(
      MESSAGES.SUBSCRIPTION.UPDATE_FAILED,
      error.message,
      500
    );
  }

  return successResponse(null, MESSAGES.SUBSCRIPTION.DELETE_BY_ID_SUCCESS);
}
