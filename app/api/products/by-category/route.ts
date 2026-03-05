"use server";

import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * 商品を取得する
 * @returns
 * @author ヤン
 */
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("category_id") ?? "all";
  const brandId = searchParams.get("brand_id") ?? "all";

  let query = supabase
    .from("products")
    .select(`*, category:categories(name), product_images(image_url, image_order)`, {
      count: "exact",
    })
    .is("is_active", true)
    .order("created_at", { ascending: false });

  if (categoryId !== "all") {
    query = query.eq("category_id", categoryId);
  }

  if (brandId !== "all") {
    query = query.eq("brand_id", brandId);
  }

  const { data, error, count } = await query;

  if (error) {
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      error.message || MESSAGES.PRODUCT.FETCH_FAILED,
      500
    );
  }

  return successResponse(
    { data, total: count ?? 0 },
    MESSAGES.PRODUCT.FETCH_SUCCESS
  );
}
