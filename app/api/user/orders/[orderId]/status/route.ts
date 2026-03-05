"use server"

import { NextRequest } from "next/server";

import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * 注文ステータスを更新する
 * @param req - リクエストオブジェクト
 * @param params - パラメータオブジェクト
 * @returns レスポンスオブジェクト
 * @author ヤン
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const supabase = await createClient();
  const { status, notes } = await req.json();
  const orderId = Number((await params).orderId);

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

  const { data, error } = await supabase
    .from("orders")
    .update({ status, notes })
    .eq("order_id", orderId)
    .eq("user_id", user.id);

  if (error)
    return errorResponse(MESSAGES.ORDER.UPDATE_FAILED, error.message, 500);

  return successResponse(data, MESSAGES.ORDER.UPDATE_SUCCESS);
}
