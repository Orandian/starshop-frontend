"use server"

import { NextRequest } from "next/server";

import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * カートに追加する
 * @param req - リクエストオブジェクト
 * @returns レスポンスオブジェクト
 * @author ヤン
 */
export async function POST(req: NextRequest) {
  const { productId, quantity } = await req.json();
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;

  if (!userId) {
    return errorResponse(
      MESSAGES.COMMON.USER_NOT_AUTHENTICATED,
      MESSAGES.COMMON.USER_NOT_AUTHENTICATED,
      401
    );
  }

  const { data: existingCart } = await supabase
    .from("shopping_carts")
    .select("cart_id")
    .eq("user_id", userId)
    .single();

  let cartId: string;

  if (existingCart) {
    cartId = existingCart.cart_id;
  } else {
    const { data: newCart, error: newCartError } = await supabase
      .from("shopping_carts")
      .insert({ user_id: userId })
      .select("cart_id")
      .single();

    if (newCartError)
      return errorResponse(
        MESSAGES.CART.ADD_FAILED,
        newCartError.message,
        500
      );
    cartId = newCart.cart_id;
  }

  const { data: existingItem } = await supabase
    .from("cart_items")
    .select("cart_item_id, quantity")
    .eq("cart_id", cartId)
    .eq("product_id", productId)
    .maybeSingle();

  let cartItem, message;

  if (existingItem) {
    const { data, error } = await supabase
      .from("cart_items")
      .update({ quantity: existingItem.quantity + quantity })
      .eq("cart_item_id", existingItem.cart_item_id)
      .select()
      .single();

    if (error)
      return errorResponse(
        MESSAGES.CART.UPDATE_FAILED,
        error.message,
        500
      );
    cartItem = data;
    message = MESSAGES.CART.UPDATE_SUCCESS;
  } else {
    const { data, error } = await supabase
      .from("cart_items")
      .insert({ cart_id: cartId, product_id: productId, quantity })
      .select()
      .single();

    if (error)
      return errorResponse(
        MESSAGES.CART.ADD_FAILED,
        error.message,
        500
      );
    cartItem = data;
    message = MESSAGES.CART.ADD_SUCCESS;
  }

  return successResponse({ cartItem }, message);
}
