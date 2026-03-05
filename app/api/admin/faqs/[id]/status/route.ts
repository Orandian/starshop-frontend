"use server"

import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { successResponse, errorResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * Change faq status
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
    .from("faqs")
    .update({ is_active: Boolean(status) })
    .eq("faqs_id", Number(id));

  if (error)
    return errorResponse(error.message, MESSAGES.FAQ.CHANGE_STATUS_FAILED, 500);

  return successResponse(
    { success: true, message: MESSAGES.FAQ.CHANGE_STATUS_SUCCESS },
    MESSAGES.FAQ.CHANGE_STATUS_SUCCESS
  );
}
