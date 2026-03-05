"use server";

import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * パスワード変更
 * @param req - リクエストオブジェクト
 * @returns レスポンスオブジェクト
 * @author ヤン
 */
export async function POST(req: NextRequest) {
  const { password, confirmPassword } = await req.json();

  /**
   * パスワードが未入力の場合
   */
  if (!password || !confirmPassword) {
    return errorResponse(
      MESSAGES.AUTH.PASSWORD_REQUIRED,
      MESSAGES.AUTH.PASSWORD_REQUIRED,
      400
    );
  }

  /**
   * パスワードが一致しない場合
   */
  if (password !== confirmPassword) {
    return errorResponse(
      MESSAGES.AUTH.PASSWORD_MATCH,
      MESSAGES.AUTH.PASSWORD_MATCH,
      400
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password,
  });

  /**
   * パスワード変更に失敗した場合
   */
  if (error) {
    return errorResponse(
      error?.message || MESSAGES.AUTH.CHANGE_PASSWORD_FAILED,
      MESSAGES.AUTH.CHANGE_PASSWORD_FAILED,
      400
    );
  }

  return successResponse({}, MESSAGES.AUTH.CHANGE_PASSWORD_SUCCESS);
}
