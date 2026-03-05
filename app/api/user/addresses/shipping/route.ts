"use server";

import { createClient } from "@/utils/supabase/server";
import { successResponse, errorResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";
import { NextRequest } from "next/server";

/**
 * 配送先住所を取得する
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
    .eq("address_type", "shipping")
    .maybeSingle();

  if (error) return errorResponse(MESSAGES.COMMON.ERROR, error.message, 500);

  return successResponse(data);
}

/**
 * 配送先住所を更新する
 * @param req - リクエストオブジェクト
 * @returns レスポンスオブジェクト
 * @author ヤン
 */
export async function PATCH(req: NextRequest) {
  try {
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

    const body = await req.json();

    // Step 1: Fetch current address before updating
    const { data: previousData, error: fetchError } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", userId)
      .eq("address_id", body.addressId)
      .maybeSingle();

    if (fetchError || !previousData) {
      return errorResponse(MESSAGES.COMMON.ERROR, fetchError?.message, 500);
    }

    // Step 2: Try to update
    const { data, error } = await supabase
      .from("addresses")
      .update({
        ...body.addressData,
        is_default: true,
        address_type: "shipping",
      })
      .eq("user_id", userId)
      .eq("address_id", body.addressId)
      .maybeSingle();

    // Step 3: If update failed, rollback manually
    if (error) {
      console.error("Update failed, reverting changes...");

      await supabase
        .from("addresses")
        .update(previousData)
        .eq("user_id", userId)
        .eq("address_id", body.addressId);

      return errorResponse(MESSAGES.COMMON.ERROR, error.message, 500);
    }

    return successResponse(data, MESSAGES.COMMON.SUCCESS, 200);
  } catch (e: unknown) {
    console.error("Request handler error:", e);
    return errorResponse("Invalid request format", e as string, 500);
  }
}

/**
 * 配送先住所を登録する
 * @param req - リクエストオブジェクト
 * @returns レスポンスオブジェクト
 * @author ヤン
 */
export async function POST(req: NextRequest) {
  try {
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

    const body = await req.json();

    const { data, error } = await supabase
      .from("addresses")
      .insert({
        ...body.addressData,
        user_id: userId,
        is_default: true,
        address_type: "shipping",
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
