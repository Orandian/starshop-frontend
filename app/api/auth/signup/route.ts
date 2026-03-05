"use server";

import { createClient } from "@/utils/supabase/server";
import { successResponse, errorResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";
import { NextRequest } from "next/server";

/**
 * サインアップAPI
 * @param req - リクエスト
 * @returns レスポンス
 * @author ヤン
 */
export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return errorResponse(
      MESSAGES.COMMON.METHOD_NOT_ALLOWED,
      MESSAGES.COMMON.METHOD_NOT_ALLOWED,
      405
    );
  }

  const { email, password, username } = await req.json();
  const supabase = await createClient();

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (user) {
    return errorResponse(
      MESSAGES.AUTH.USER_ALREADY_EXISTS,
      MESSAGES.AUTH.USER_ALREADY_EXISTS,
      400
    );
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
    },
  });

  /**
   * サインアップ失敗
   */
  if (error || !data.user) {
    return errorResponse(
      error?.message || MESSAGES.AUTH.SIGNUP_FAILED,
      MESSAGES.AUTH.SIGNUP_FAILED,
      400
    );
  }

  const userId = data.user.id;

  /**
   * ユーザーをデータベースに保存
   */
  const { error: insertError } = await supabase.from("users").insert({
    user_id: userId,
    email,
    username,
  });

  if (insertError) {
    return errorResponse(
      insertError?.message || MESSAGES.AUTH.SIGNUP_FAILED,
      MESSAGES.AUTH.SIGNUP_FAILED,
      400
    );
  }

  return successResponse(
    {
      userId: data.user.id,
    },
    MESSAGES.AUTH.SIGNUP_SUCCESS
  );
}
