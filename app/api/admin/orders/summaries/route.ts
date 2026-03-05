"use server"

import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * Get order summaries
 * @param req - Request
 * @returns Order summaries
 * @author ヤン
 */
export const GET = async (req: NextRequest) => {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") ?? 1);
  const pageSize = Number(searchParams.get("pageSize") ?? 10);
  const orderDate = searchParams.get("orderDate") ?? "";
  const customerName = searchParams.get("customerName") ?? "";
  const status = searchParams.get("status") ?? "all";

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("order_product_summary")
    .select("*", { count: "exact" })
    .order("order_date", { ascending: false })
    .range(from, to);

  if (orderDate) {
    query = query.like("order_date::text", `%${orderDate}%`);
  }
  if (customerName) {
    query = query.or(`customer_name.ilike.%${customerName}%`);
  }
  if (status !== "all") {
    query = query.eq("order_status", status);
  }

  const { data, error, count } = await query;
  if (error)
    return errorResponse(
      error.message,
      MESSAGES.ORDER.GET_SUMMARIES_FAILED,
      500
    );

  return successResponse(
    {
      data,
      total: count ?? 0,
      page,
      pageSize,
    },
    MESSAGES.ORDER.GET_SUMMARIES_SUCCESS
  );
};
