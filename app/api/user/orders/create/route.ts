"use server"

import { NextRequest } from "next/server";

import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * 注文を保存する
 * @param req - リクエストオブジェクト
 * @returns レスポンスオブジェクト
 * @author ヤン
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json();
  const order = body.order;

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user)
    return errorResponse(
      MESSAGES.COMMON.USER_NOT_AUTHENTICATED,
      MESSAGES.COMMON.USER_NOT_AUTHENTICATED,
      401
    );

  const { data: shipping } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_default", true)
    .eq("address_type", "shipping")
    .single();
  const { data: billing } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_default", true)
    .eq("address_type", "billing")
    .single();

  const { data, error } = await supabase
    .from("orders")
    .insert({
      ...order,
      user_id: user.id,
      shipping_address_id: shipping?.address_id,
      billing_address_id: billing?.address_id,
    })
    .select()
    .single();

  if (error)
    return errorResponse(MESSAGES.ORDER.CREATE_FAILED, error.message, 500);

  return successResponse(data, MESSAGES.ORDER.CREATE_SUCCESS);
}
