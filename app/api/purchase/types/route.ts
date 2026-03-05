import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * 購入方法を取得する
 * @returns
 * @author ヤン
 */
export async function GET() {
  const supabase = await createClient();

  const query = supabase
    .from("purchase_types")
    .select(`*`)
    .order("interval_month", { ascending: true });

  const { data, error } = await query;

  if (error) {
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      error.message || MESSAGES.PURCHASE_TYPE.FETCH_FAILED,
      500
    );
  }

  return successResponse(data, MESSAGES.PURCHASE_TYPE.FETCH_SUCCESS);
}
