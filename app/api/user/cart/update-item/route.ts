"use server"

import { NextRequest } from "next/server";

import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * カートアイテムの数量を更新する
 * @param req - リクエストオブジェクト
 * @returns レスポンスオブジェクト
 * @author ヤン
 */
export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { cartItemId, productId, quantity } = await req.json();

  const { data, error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("cart_item_id", cartItemId)
    .eq("product_id", productId)
    .select()
    .single();

  if (error) return errorResponse(MESSAGES.CART.UPDATE_FAILED, error.message);
  return successResponse(data, MESSAGES.CART.UPDATE_SUCCESS);
}
