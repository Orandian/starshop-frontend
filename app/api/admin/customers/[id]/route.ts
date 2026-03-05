"use server"

import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * Get customer by id
 * @param req - Request
 * @returns Customer
 * @author ヤン
 */
export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const id = (await context.params).id;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", id);

  if (error)
    return errorResponse(MESSAGES.CUSTOMER.GET_BY_ID_FAILED, error.message);

  return successResponse(data[0], MESSAGES.CUSTOMER.GET_BY_ID_SUCCESS);
}
