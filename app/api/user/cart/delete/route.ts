"use server"

import { NextRequest } from "next/server";

import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * カートを削除する
 * @param req - リクエストオブジェクト
 * @returns レスポンスオブジェクト
 * @author ヤン
 */
export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { cartId } = await req.json();

  const { error: deleteItemsError } = await supabase
    .from("cart_items")
    .delete()
    .eq("cart_id", cartId);

  if (deleteItemsError)
    return errorResponse(MESSAGES.CART.DELETE_FAILED, deleteItemsError.message);

  const { error: deleteCartError } = await supabase
    .from("shopping_carts")
    .delete()
    .eq("cart_id", cartId);

  if (deleteCartError)
    return errorResponse(MESSAGES.CART.DELETE_FAILED, deleteCartError.message);

  return successResponse(null, MESSAGES.CART.DELETE_SUCCESS);
}
