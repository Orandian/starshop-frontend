"use server"

import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * 商品を取得する
 * @returns
 * @author ヤン
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const productId = Number((await params).id);

  const { data, error } = await supabase
    .from("product_recommendations")
    .select(
      `
      *,
      recommended_product:products!product_recommendations_recommended_product_id_fkey(
        *,
        product_images(image_url, image_order)
      )
    `
    )
    .eq("product_id", productId)
    .limit(3)
    .order("created_at", { ascending: false });

  if (error) {
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      error.message || MESSAGES.PRODUCT.GET_RECOMMENDATIONS_FAILED,
      500
    );
  }

  return successResponse(data, MESSAGES.PRODUCT.GET_RECOMMENDATIONS_SUCCESS);
}
