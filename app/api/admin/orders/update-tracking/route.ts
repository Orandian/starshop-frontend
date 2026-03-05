"use server"

import { NextRequest } from "next/server";

import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * Update order tracking number
 * @param req - Request
 * @returns Updated order details
 * @author ヤン
 */
export const POST = async (req: NextRequest) => {
  const { orderId, trackingNumber, shippingCompany, shippingDate, status } = await req.json();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .update({
      tracking_number: trackingNumber,
      shipping_company: shippingCompany,
      shipping_date: shippingDate,
      status,
    })
    .eq("order_id", orderId);

  if (error)
    return errorResponse(
      error.message,
      MESSAGES.ORDER.UPDATE_TRACKING_FAILED,
      500
    );
  return successResponse(data, MESSAGES.ORDER.UPDATE_TRACKING_SUCCESS);
};
