"use server"

import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * Get customer addresses by id
 * @param req - Request
 * @returns Customer addresses
 * @author ヤン
 */
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const id = (await params).id;

  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", id);

  if (error)
    return errorResponse(MESSAGES.ADDRESS.GET_BY_ID_FAILED, error.message);

  return successResponse(data, MESSAGES.ADDRESS.GET_BY_ID_SUCCESS);
}
