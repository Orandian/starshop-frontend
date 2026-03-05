"use server"

import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * カートアイテムを取得する
 * @param req - リクエストオブジェクト
 * @param params - パラメータオブジェクト
 * @returns レスポンスオブジェクト
 * @author ヤン
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ cartId: string }> }
) {
  const cartId = Number((await params).cartId);

  if (isNaN(cartId)) {
    return errorResponse(
      MESSAGES.COMMON.USER_NOT_AUTHENTICATED,
      MESSAGES.COMMON.USER_NOT_AUTHENTICATED,
      401
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("cart_items")
    .select(
      `
      *,
      products (
        product_id,
        name,
        sale_price
      )
    `
    )
    .eq("cart_id", cartId);

  if (error) {
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      error.message || MESSAGES.CART.FETCH_FAILED,
      500
    );
  }

  return successResponse(data, MESSAGES.CART.FETCH_SUCCESS);
}
