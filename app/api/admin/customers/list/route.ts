"use server"

import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * Get customers with total order money
 * with pagination and optional name/email filtering and status filtering
 *
 * @param page - Page number
 * @param pageSize - Number of records per page
 * @param searchQuery - Search keyword to filter by name or email
 * @param status - Status to filter by
 * @returns List of customers with total order amount and total count
 * @author ヤン
 */
export async function GET(req: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");
  const searchQuery = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("customer_with_total_orders")
    .select("*", { count: "exact" })
    .range(from, to)
    .order("registration_date", { ascending: false });

  if (searchQuery) {
    query = query.or(
      `name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`
    );
  }

  if (status !== "0") {
    query = query.eq("is_active", status === "1");
  }

  const { data, error, count } = await query;
  if (error) return errorResponse(MESSAGES.COMMON.ERROR, error.message);

  return successResponse(
    {
      data,
      total: count ?? 0,
      page,
      pageSize,
    },
    MESSAGES.COMMON.SUCCESS
  );
}
