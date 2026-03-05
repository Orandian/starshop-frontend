"use server"

import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * カートアイテムのカウントを取得する
 * @returns レスポンスオブジェクト
 * @author ヤン
 */
export async function GET() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;

  if (!userId)
    return errorResponse(
      MESSAGES.COMMON.USER_NOT_AUTHENTICATED,
      MESSAGES.COMMON.USER_NOT_AUTHENTICATED,
      401
    );

  const { count, error } = await supabase
    .from("user_cart_items_with_user")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error)
    return errorResponse(MESSAGES.CART.GET_COUNT_FAILED, error.message);
  return successResponse(count ?? 0, MESSAGES.CART.GET_COUNT_SUCCESS);
}
