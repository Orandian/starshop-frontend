"use server"

import { NextRequest } from "next/server";

import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * Update product
 * @param req - Request
 * @returns
 * @author ヤン
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { product, recommendProducts } = await req.json();

  const { data, error } = await supabase
    .from("products")
    .update(product)
    .eq("product_id", product.product_id)
    .select("*");

  if (error)
    return errorResponse(error.message, MESSAGES.PRODUCT.UPDATE_FAILED, 500);

  const { error: recommendError } = await supabase
    .from("product_recommendations")
    .delete()
    .eq("product_id", product.product_id);

  if (recommendError)
    return errorResponse(
      recommendError.message,
      MESSAGES.PRODUCT.UPDATE_FAILED,
      500
    );

  const { error: insertError } = await supabase
    .from("product_recommendations")
    .insert(
      recommendProducts.map((product_id: number) => ({
        product_id: product.product_id,
        recommended_product_id: product_id,
      }))
    );

  if (insertError)
    return errorResponse(
      insertError.message,
      MESSAGES.PRODUCT.UPDATE_FAILED,
      500
    );

  return successResponse({
    success: true,
    message: MESSAGES.PRODUCT.UPDATE_SUCCESS,
    data,
  });
}
