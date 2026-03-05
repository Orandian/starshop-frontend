"use server"

import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * 注文履歴を取得する
 * @returns
 * @author ヤン
 */
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;
  const orderDate = searchParams.get("orderDate") || "";
  const status = searchParams.get("status") || "all";

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

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("order_product_summary")
    .select("*", { count: "exact" })
    .eq("customer_id", user.id)
    .order("order_date", { ascending: false })
    .range(from, to);

  if (orderDate) {
    query = query.like("order_date::text", `%${orderDate}%`);
  }

  if (status !== "all") {
    query = query.eq("order_status", status);
  }

  const { data, error, count } = await query;

  if (error)
    return errorResponse(MESSAGES.ORDER.FETCH_FAILED, error.message, 500);

  return successResponse(
    { data, total: count, page, pageSize },
    MESSAGES.ORDER.FETCH_SUCCESS
  );
}
