"use server";

import { NextRequest } from "next/server";

import { createClient } from "@/utils/supabase/server";
import { AddressForm } from "@/types/addresses";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * 請求先住所を取得する
 * @returns
 * @author ヤン
 */
export async function GET() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;

  if (!userId)
    return errorResponse(
      MESSAGES.COMMON.USER_NOT_AUTHENTICATED,
      MESSAGES.COMMON.USER_NOT_AUTHENTICATED,
      401
    );

  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", userId)
    .eq("is_default", true)
    .eq("address_type", "billing")
    .maybeSingle();

  if (error) return errorResponse(MESSAGES.COMMON.ERROR, error.message, 500);

  return successResponse(data);
}

/**
 * 請求先住所を更新する
 * @param req - リクエストオブジェクト
 * @returns レスポンスオブジェクト
 * @author ヤン
 */
export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;
  const body: { addressId: number; addressData: AddressForm } =
    await req.json();

  if (!userId)
    return errorResponse(
      MESSAGES.COMMON.USER_NOT_AUTHENTICATED,
      MESSAGES.COMMON.USER_NOT_AUTHENTICATED,
      401
    );

  const { data, error } = await supabase
    .from("addresses")
    .update({
      ...body.addressData,
      is_default: true,
      address_type: "billing",
    })
    .eq("user_id", userId)
    .eq("address_id", body.addressId)
    .single();

  if (error) return errorResponse(MESSAGES.COMMON.ERROR, error.message, 500);

  return successResponse(data);
}

/**
 * 請求先住所を登録する
 * @param req - リクエストオブジェクト
 * @returns レスポンスオブジェクト
 * @author ヤン
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    const body = await req.json();

    if (!userId)
      return errorResponse(
        MESSAGES.COMMON.USER_NOT_AUTHENTICATED,
        MESSAGES.COMMON.USER_NOT_AUTHENTICATED,
        401
      );

    const { data, error } = await supabase
      .from("addresses")
      .insert({
        ...body.addressData,
        user_id: userId,
        is_default: true,
        address_type: "billing",
      })
      .select()
      .single();

    if (error) {
      return errorResponse(MESSAGES.COMMON.ERROR, error.message, 500);
    }

    return successResponse(data, MESSAGES.COMMON.SUCCESS, 200);
  } catch (e: unknown) {
    console.error("Request handler error:", e);
    return errorResponse("Invalid request format", e as string, 500);
  }
}
