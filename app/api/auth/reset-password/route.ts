"use server";

import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * パスワードリセット
 * @param req - リクエストオブジェクト
 * @returns レスポンスオブジェクト
 * @author ヤン
 */
export async function POST(req: NextRequest) {
  const { email } = await req.json();

  /**
   * メールアドレスが未入力の場合
   */
  if (!email) {
    return errorResponse(
      MESSAGES.COMMON.METHOD_NOT_ALLOWED,
      MESSAGES.COMMON.METHOD_NOT_ALLOWED,
      405
    );
  }

  const supabase = await createClient();

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (!user) {
    return errorResponse(
      MESSAGES.AUTH.USER_NOT_AUTHENTICATED,
      MESSAGES.AUTH.USER_NOT_AUTHENTICATED,
      401
    );
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/change-password`,
  });

  /**
   * パスワードリセットに失敗した場合
   */
  if (error) {
    return errorResponse(
      error?.message || MESSAGES.AUTH.RESET_PASSWORD_FAILED,
      MESSAGES.AUTH.RESET_PASSWORD_FAILED,
      400
    );
  }

  return successResponse({}, MESSAGES.AUTH.RESET_PASSWORD_EMAIL_SENT);
}
