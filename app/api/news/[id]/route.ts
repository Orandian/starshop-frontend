"use server"

import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * ニュースを取得する
 * @returns
 * @author ヤン
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const newsId = Number((await params).id);

  if (isNaN(newsId)) {
    return errorResponse(
      MESSAGES.NEWS.INVALID_ID,
      MESSAGES.NEWS.INVALID_ID,
      401
    );
  }

  const { data, error } = await supabase
    .from("news")
    .select("news_id, title, content, created_at, news_date")
    .eq("news_id", newsId)
    .single();

  if (error) {
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      error.message || MESSAGES.NEWS.GET_BY_ID_FAILED,
      500
    );
  }

  return successResponse(data, MESSAGES.NEWS.GET_BY_ID_SUCCESS);
}
