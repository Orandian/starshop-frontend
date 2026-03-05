"use server"

import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * パスワード更新
 * @param req - リクエストオブジェクト
 * @returns レスポンスオブジェクト
 * @author ヤン
 */
export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { newPassword }: { newPassword: string } = await req.json();

  if (!newPassword) {
    return errorResponse(
      MESSAGES.PASSWORD.PASSWORD_REQUIRED,
      MESSAGES.PASSWORD.PASSWORD_REQUIRED,
      400
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return errorResponse(MESSAGES.PASSWORD.UPDATE_FAILED, error.message, 500);
  }

  return successResponse(
    { success: true, message: MESSAGES.PASSWORD.UPDATE_SUCCESS },
    MESSAGES.PASSWORD.UPDATE_SUCCESS
  );
}
