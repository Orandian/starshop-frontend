"use server"

import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * FAQを取得する
 * @returns
 * @author ヤン
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const faqId = Number((await params).id);

  if (isNaN(faqId)) {
    return errorResponse(MESSAGES.FAQ.INVALID_ID, MESSAGES.FAQ.INVALID_ID, 401);
  }

  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("faqs_id", faqId)
    .single();

  if (error) {
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      error.message || MESSAGES.FAQ.GET_BY_ID_FAILED,
      500
    );
  }

  return successResponse(data, MESSAGES.FAQ.GET_BY_ID_SUCCESS);
}
