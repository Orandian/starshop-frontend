"use server";

import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";
import { NextRequest } from "next/server";

/**
 * Get news list
 * @param req - Request
 * @returns News list
 * @author ヤン
 */
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "10");
  const title = searchParams.get("title") ?? "";
  const newsDate = searchParams.get("newsDate") ?? "";

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("news")
    .select("*", { count: "exact" })
    .eq("is_active", true)
    .ilike("title", `%${title}%`)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (newsDate) {
    query = query.eq("news_date", newsDate);
  }

  const { data, error, count } = await query;

  if (error) return errorResponse(error.message, MESSAGES.NEWS.FETCH_FAILED, 500);

  return successResponse(
    { data, total: count ?? 0, page, pageSize },
    MESSAGES.NEWS.FETCH_SUCCESS
  );
}