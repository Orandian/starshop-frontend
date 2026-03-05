"use server"

import { NextRequest } from "next/server";

import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * 注文アイテムを保存する
 * @param req - リクエストオブジェクト
 * @returns レスポンスオブジェクト
 * @author ヤン
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json();

  const { data, error } = await supabase
    .from("order_items")
    .insert(body)
    .select();

  if (error)
    return errorResponse(MESSAGES.ORDER.CREATE_FAILED, error.message, 500);

  return successResponse(data, MESSAGES.ORDER.CREATE_SUCCESS);
}
