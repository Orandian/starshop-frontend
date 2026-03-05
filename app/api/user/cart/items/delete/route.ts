"use server"

import { NextRequest } from "next/server";

import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * カートアイテムを削除する
 * @param req - リクエストオブジェクト
 * @returns レスポンスオブジェクト
 * @author ヤン
 */
export async function DELETE(req: NextRequest) {
  const { cartItemId, productId } = await req.json();
  const supabase = await createClient();
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("cart_item_id", cartItemId)
    .eq("product_id", productId);

  if (error) return errorResponse(MESSAGES.CART.DELETE_FAILED, error.message);

  return successResponse(null, MESSAGES.CART.DELETE_SUCCESS);
}