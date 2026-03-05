"use server"

import { errorResponse, successResponse } from "@/lib/api/response";
import { createClient } from "@/utils/supabase/server";
import { MESSAGES } from "@/types/messages";

/**
 * カテゴリを取得する
 * @returns
 * @author ヤン
 */
export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("categories").select(`
      *,
      parent:parent_category_id(name)
    `);

  if (error) {
    return errorResponse(MESSAGES.COMMON.ERROR, error.message, 500);
  }

  return successResponse(
    {
      data,
      total: data.length,
    },
    MESSAGES.CATEGORY.FETCH_SUCCESS
  );
}
