"use server"

import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * Get top products
 * @param req - Request
 * @returns Top products
 * @author ヤン
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { fromDate, toDate } = await req.json();

  const { data, error } = await supabase
    .rpc("get_product_sales", {
      start_date: fromDate.split("T")[0],
      end_date: toDate.split("T")[0],
    })
    .select("*");

  if (error) {
    return errorResponse(MESSAGES.COMMON.ERROR, error.message, 500);
  }

  return successResponse(data, MESSAGES.COMMON.SUCCESS);
}