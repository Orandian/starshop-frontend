"use server";

import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

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
  const status = searchParams.get("status") ?? "";
  const newsDate = searchParams.get("newsDate") ?? "";

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("news")
    .select("*", { count: "exact" })
    .ilike("title", `%${title}%`)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (status !== "0") {
    query = query.eq("is_active", status === "1");
  }

  if (newsDate) {
    query = query.eq("news_date", newsDate);
  }

  const { data, error, count } = await query;

  if (error)
    return errorResponse(error.message, MESSAGES.NEWS.FETCH_FAILED, 500);

  return successResponse(
    { data, total: count ?? 0, page, pageSize },
    MESSAGES.NEWS.FETCH_SUCCESS
  );
}

/**
 * Create news
 * @param req - Request
 * @returns News
 * @author ヤン
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { title, content, date } = await req.json();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;

  if (!userId)
    return errorResponse(
      MESSAGES.COMMON.USER_NOT_AUTHENTICATED,
      MESSAGES.COMMON.USER_NOT_AUTHENTICATED,
      401
    );

  const { data, error } = await supabase
    .from("news")
    .insert([{ title, content, user_id: userId, news_date: date }])
    .select("*");

  if (error)
    return errorResponse(error.message, MESSAGES.NEWS.CREATE_FAILED, 500);

  return successResponse({ data }, MESSAGES.NEWS.CREATE_SUCCESS);
}
