"use server"

import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * FAQを取得する
 * @returns
 * @author ヤン
 */
export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("faqs").select("*");

  if (error) {
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      error.message || MESSAGES.FAQ.FETCH_FAILED,
      500
    );
  }

  return successResponse(data, MESSAGES.FAQ.FETCH_SUCCESS);
}
