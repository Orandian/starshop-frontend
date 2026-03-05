"use server"

import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * ニュースを取得する
 * @returns
 * @author ヤン
 */
export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("news").select("*").order("news_date", { ascending: false });

  if (error) {
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      error.message || MESSAGES.NEWS.FETCH_FAILED,
      500
    );
  }

  return successResponse(data, MESSAGES.NEWS.FETCH_SUCCESS);
}
