"use server"

import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * カートアイテムを取得する
 * @returns
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

  const { data: cart } = await supabase
    .from("shopping_carts")
    .select("cart_id")
    .eq("user_id", userId)
    .maybeSingle();

  const cartId = cart?.cart_id;

  if (!cartId) {
    return successResponse([], MESSAGES.CART.CART_NOT_FOUND);
  }

  const { data, error } = await supabase
    .from("cart_summary_with_products")
    .select("*")
    .eq("cart_id", cartId)
    .maybeSingle();

  if (error)
    return errorResponse(MESSAGES.CART.FETCH_FAILED, error.message, 500);
  return successResponse(data, MESSAGES.CART.FETCH_SUCCESS);
}
