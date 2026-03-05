"use server"

import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * Get recommend products to choose
 * @param req - Request
 * @returns
 * @example
 * const { data, isLoading, error } = getRecommendProductsToChoose(req);
 * @author ヤン
 */
export async function GET(req: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  let query = supabase
    .from("products")
    .select("product_id, name, product_images(image_url)", {
      count: "exact",
    })
    .is("is_active", true)
    .order("created_at", { ascending: false });

  if (productId) {
    query = query.neq("product_id", Number(productId));
  }

  const { data, error } = await query;

  if (error)
    return errorResponse(error.message, MESSAGES.PRODUCT.GET_RECOMMEND_PRODUCTS_FAILED, 500);

  return successResponse({ data }, MESSAGES.PRODUCT.GET_RECOMMEND_PRODUCTS_SUCCESS);
}