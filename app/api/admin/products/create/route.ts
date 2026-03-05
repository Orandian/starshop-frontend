"use server"

import { NextRequest } from "next/server";

import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * Create product
 * @param req - Request
 * @returns
 * @author ヤン
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { product, recommendProducts } = await req.json();

  const { data, error } = await supabase
    .from("products")
    .insert([product])
    .select("*");
  if (error)
    return errorResponse(error.message, MESSAGES.PRODUCT.CREATE_FAILED, 500);

  const { error: recommendError } = await supabase
    .from("product_recommendations")
    .insert(
      recommendProducts.map((product_id: number) => ({
        product_id: data?.[0].product_id,
        recommended_product_id: product_id,
      }))
    );

  if (recommendError)
    return errorResponse(
      recommendError.message,
      MESSAGES.PRODUCT.CREATE_FAILED,
      500
    );

  return successResponse({
    success: true,
    message: MESSAGES.PRODUCT.CREATE_SUCCESS,
    data,
  }, MESSAGES.PRODUCT.CREATE_SUCCESS);
}
