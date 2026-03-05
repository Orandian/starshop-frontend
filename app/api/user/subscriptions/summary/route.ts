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
  const purchaseDate = searchParams.get("purchaseDate") || "";
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
    .from("regular_subscription_summary")
    .select("*", { count: "exact" })
    .eq("customer_id", user.id)
    .order("purchase_date", { ascending: false })
    .range(from, to);

  if (purchaseDate) {
    query = query.like("purchase_date::text", `%${purchaseDate}%`);
  }

  if (status !== "all") {
    query = query.eq("cart_status", status);
  }

  const { data, error, count } = await query;

  if (error)
    return errorResponse(MESSAGES.SUBSCRIPTION.FETCH_FAILED, error.message, 500);

  return successResponse(
    { data, total: count, page, pageSize },
    MESSAGES.SUBSCRIPTION.FETCH_SUCCESS
  );
}
