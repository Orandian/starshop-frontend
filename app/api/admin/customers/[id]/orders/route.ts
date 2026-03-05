"use server";

import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * Get customer orders by id
 * @param req - Request
 * @returns Customer orders
 * @author ヤン
 */
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const id = (await context.params).id;
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const query = supabase
    .from("order_product_summary")
    .select("*", { count: "exact" })
    .eq("customer_id", id)
    .order("order_date", { ascending: false })
    .range(from, to);

  const { data, error, count } = await query;
  if (error)
    return errorResponse(MESSAGES.ORDER.GET_BY_ID_FAILED, error.message);

  return successResponse(
    {
      data,
      total: count ?? 0,
      page,
      pageSize,
    },
    MESSAGES.ORDER.GET_BY_ID_SUCCESS
  );
}
