"use server"

import { NextRequest } from "next/server";

import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * カートを更新する
 * @param req - リクエストオブジェクト
 * @returns レスポンスオブジェクト
 * @author ヤン
 */
export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { cartId, items } = await req.json();

  const { error: deleteError } = await supabase
    .from("cart_items")
    .delete()
    .eq("cart_id", cartId);

  if (deleteError) return errorResponse(deleteError.message);

  const { data, error: insertError } = await supabase
    .from("cart_items")
    .insert(
      items.map(
        ({ productId, quantity }: { productId: number; quantity: number }) => ({
          cart_id: cartId,
          product_id: productId,
          quantity,
        })
      )
    )
    .select();

  if (insertError)
    return errorResponse(MESSAGES.CART.UPDATE_FAILED, insertError.message);

  return successResponse(data, MESSAGES.CART.UPDATE_SUCCESS);
}
