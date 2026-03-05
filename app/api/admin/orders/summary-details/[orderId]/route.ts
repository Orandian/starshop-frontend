"use server"

import { NextRequest } from "next/server";

import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * Get order details by id
 * @param req - Request
 * @returns Order details
 * @author ヤン
 */
export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) => {
  const supabase = await createClient();
  const orderId = Number((await params).orderId);

  const { data, error } = await supabase
    .from("order_details_summary")
    .select("*")
    .eq("order_id", orderId);

  if (error) return errorResponse(error.message, MESSAGES.COMMON.ERROR, 500);

  return successResponse(data, MESSAGES.COMMON.SUCCESS);
};