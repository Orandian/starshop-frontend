"use server";

import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";
import { NextRequest } from "next/server";

/**
 * 郵便番号を取得する
 * @param req - リクエストオブジェクト
 * @returns レスポンスオブジェクト
 * @author ヤン
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { postcode } = await req.json();

  if (!postcode)
    return errorResponse(
      MESSAGES.ADDRESS.INVALID_POSTCODE,
      MESSAGES.ADDRESS.INVALID_POSTCODE,
      400
    );

  const { data, error } = await supabase
    .from("address_master")
    .select("city_ward_town, address, prefecture")
    .eq("post_code", postcode)
    .single();

  if (error)
    return errorResponse(
      MESSAGES.ADDRESS.GET_BY_POSTCODE_FAILED,
      error.message,
      500
    );

  return successResponse(data);
}
