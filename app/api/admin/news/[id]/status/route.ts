"use server"

import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { successResponse, errorResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * Update news status
 * @param req - Request
 * @returns
 * @author ヤン
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { status } = await req.json();

  const id = (await params).id;

  const { error } = await supabase
    .from("news")
    .update({ is_active: Boolean(status) })
    .eq("news_id", Number(id));

  if (error)
    return errorResponse(
      error.message,
      MESSAGES.NEWS.CHANGE_STATUS_FAILED,
      500
    );

  return successResponse(
    {
      success: true,
      message: MESSAGES.NEWS.CHANGE_STATUS_SUCCESS,
    },
    MESSAGES.NEWS.CHANGE_STATUS_SUCCESS
  );
}
