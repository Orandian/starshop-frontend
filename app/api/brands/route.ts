"use server";

import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * ブランドを取得する
 * @returns
 * @author ヤン
 */
export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("brands")
    .select("brand_id, name")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      error.message || MESSAGES.BRAND.FETCH_FAILED,
      500
    );
  }

  return successResponse(data, MESSAGES.BRAND.FETCH_SUCCESS);
}
