"use server"

import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * Change customer status
 * @param req - Request
 * @returns
 * @author ヤン
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const { customerId, status } = await req.json();

  const { error } = await supabase
    .from("users")
    .update({ is_active: status })
    .eq("user_id", customerId);

  if (error)
    return errorResponse(MESSAGES.CUSTOMER.CHANGE_STATUS_FAILED, error.message);

  return successResponse(
    { success: true, message: MESSAGES.CUSTOMER.CHANGE_STATUS_SUCCESS },
    MESSAGES.CUSTOMER.CHANGE_STATUS_SUCCESS
  );
}
