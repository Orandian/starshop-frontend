import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * ユーザーを取得する
 * @returns
 * @author ヤン
 */
export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      error.message || MESSAGES.AUTH.USER_FAILED,
      500
    );
  }

  return successResponse(data, MESSAGES.AUTH.USER_SUCCESS);
}
