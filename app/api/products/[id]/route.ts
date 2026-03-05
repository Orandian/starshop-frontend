// app/api/products/[id]/route.ts

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
    .from("products")
    .select(`*, category:categories(name), product_images(image_url, image_order), brand:brands(name)`, {
      count: "exact",
    })
    .eq("product_id", productId);

  if (error) {
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      error.message || MESSAGES.PRODUCT.GET_BY_ID_FAILED,
      500
    );
  }

  return successResponse(data, MESSAGES.PRODUCT.GET_BY_ID_SUCCESS);
}
