"use server";

import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { successResponse, errorResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * Get brands list
 * @param req - Request
 * @returns Brands list
 * @author ヤン
 */
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "10");
  const keyword = searchParams.get("keyword") ?? "";
  const status = searchParams.get("status") ?? "";
  const faqDate = searchParams.get("faqDate") ?? "";

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
  .from("brands")
  .select(`
    *,
    products(
      product_id
    )
  `, { count: "exact" })
  .ilike("name", `%${keyword}%`)
  .order("created_at", { ascending: false })
  .range(from, to);

  if (status !== "0") {
    query = query.eq("is_active", status === "1");
  }

  if (faqDate) {
    const date = new Date(faqDate);
    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);

    query = query
      .gte("created_at", date.toISOString())
      .lt("created_at", nextDate.toISOString());
  }

  const { data, error, count } = await query;

  if (error)
    return errorResponse(error.message, MESSAGES.BRAND.FETCH_FAILED, 500);

  return successResponse(
    { data, total: count ?? 0, page, pageSize },
    MESSAGES.BRAND.FETCH_SUCCESS
  );
}

/**
 * Create brand
 * @param req - Request
 * @returns Brand
 * @author ヤン
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json();

  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;

  if (!userId)
    return errorResponse(
      MESSAGES.COMMON.USER_NOT_AUTHENTICATED,
      MESSAGES.COMMON.USER_NOT_AUTHENTICATED,
      401
    );

  const { data, error } = await supabase
    .from("brands")
    .insert([{ ...body }])
    .select("*");

  if (error)
    return errorResponse(error.message, MESSAGES.BRAND.CREATE_FAILED, 500);

  return successResponse({ data }, MESSAGES.BRAND.CREATE_SUCCESS);
}
