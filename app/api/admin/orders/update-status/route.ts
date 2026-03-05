"use server"

import { NextRequest } from "next/server";

import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * Update order status
 * @param req - Request
 * @returns Updated order
 * @author ヤン
 */
export const POST = async (req: NextRequest) => {
  const { orderId, status, notes } = await req.json();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .update({ status, notes })
    .eq("order_id", orderId);

  if (error)
    return errorResponse(
      error.message,    
      MESSAGES.ORDER.UPDATE_STATUS_FAILED,
      500
    );
  return successResponse(data, MESSAGES.ORDER.UPDATE_STATUS_SUCCESS);
};