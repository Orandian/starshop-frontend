"use server"

import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";
import { NextRequest } from "next/server";

type RecommendedProduct = {
  product_id: number;
  recommended_product_id: number;
  recommended_product: {
    name: string;
    product_images: {
      image_url: string;
    }[];
  } | null;
};

/**
 * Get recommend products
 * @param params - Params
 * @returns
 * @example
 * const { data, isLoading, error } = getRecommendProducts({ productId });
 * @author ヤン
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
    
  const supabase = await createClient();
  const productId = Number((await params).productId);

  if (isNaN(productId)) {
    return errorResponse(
      "Invalid productId",
      MESSAGES.PRODUCT.GET_RECOMMEND_PRODUCTS_FAILED,
      400
    );
  }

  const { data, error } = await supabase
    .from("product_recommendations")
    .select(
      `
      product_id,
      recommended_product_id,
      recommended_product:products!product_recommendations_recommended_product_id_fkey(
        name,
        product_images(image_url)
      )
    `,
      { count: "exact" }
    )
    .eq("product_id", productId);

  if (error)
    return errorResponse(
      error.message,
      MESSAGES.PRODUCT.GET_RECOMMEND_PRODUCTS_FAILED,
      500
    );

  const cleanedData = (data ?? []).map((item) => ({
    ...item,
    recommended_product: Array.isArray(item.recommended_product)
      ? item.recommended_product[0] ?? null
      : item.recommended_product,
  })) as RecommendedProduct[];

  return successResponse({ data: cleanedData }, MESSAGES.PRODUCT.GET_RECOMMEND_PRODUCTS_SUCCESS);
}
