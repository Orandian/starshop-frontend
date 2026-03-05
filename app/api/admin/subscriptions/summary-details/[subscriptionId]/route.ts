"use server";

import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * 購入履歴の詳細を取得する
 * @param req - リクエストオブジェクト
 * @param params - パラメータオブジェクト
 * @returns レスポンスオブジェクト
 * @author ヤン
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ subscriptionId: string }> }
) {
  const supabase = await createClient();
  const subscriptionId = Number((await params).subscriptionId);

  const { data, error } = await supabase
    .from("subscription_details_summary")
    .select("*")
    .eq("regular_purchase_cart_id", subscriptionId);

  if (error)
    return errorResponse(
      MESSAGES.SUBSCRIPTION.GET_BY_ID_FAILED,
      error.message,
      500
    );

  return successResponse(data, MESSAGES.SUBSCRIPTION.GET_BY_ID_SUCCESS);
}
