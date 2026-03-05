"use server";

import { createClient } from "@/utils/supabase/server";
import { successResponse, errorResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";
import { BrandList } from "@/types/brands";

/**
 * Get brands list
 * @returns Brands list
 * @author ヤン
 */
export async function GET() {
  const supabase = await createClient();

  const query = supabase
    .from("brands")
    .select("brand_id, name")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  const { data, error } = await query;

  if (error)
    return errorResponse(error.message, MESSAGES.BRAND.FETCH_FAILED, 500);

  return successResponse(data as BrandList[], MESSAGES.BRAND.FETCH_SUCCESS);
}
