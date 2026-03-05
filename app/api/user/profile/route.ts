"use server";

import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

/**
 * プロフィール取得
 * @returns
 * @author ヤン
 */
export async function GET() {
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

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    return errorResponse(MESSAGES.COMMON.ERROR, error.message, 500);
  }

  return successResponse(data);
}

/**
 * プロフィール更新
 * @param req - Request
 * @returns
 * @author ヤン
 */
export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { name } = await req.json();

  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;

  if (!userId) {
    return errorResponse(
      MESSAGES.COMMON.USER_NOT_AUTHENTICATED,
      MESSAGES.COMMON.USER_NOT_AUTHENTICATED,
      401
    );
  }

  const { data, error } = await supabase
    .from("users")
    .update({ username: name })
    .eq("user_id", userId)
    .select("*");

  if (error)
    return errorResponse(error.message, MESSAGES.USER.UPDATE_FAILED, 500);

  return successResponse({
    success: true,
    message: MESSAGES.USER.UPDATE_SUCCESS,
    data,
  });
}
