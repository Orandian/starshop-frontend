"use server";

import { NextRequest } from "next/server";

import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * Get product by id
 * @param req - Request
 * @param params - Params
 * @returns Product
 * @author ヤン
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const supabase = await createClient();
  const productId = (await params).productId;

  const { data: productData, error: productError } = await supabase
    .from("products")
    .select("*, category:categories(name), brand:brands(name)")
    .eq("product_id", productId)
    .single();

  if (productError) {
    return errorResponse(
      productError.message,
      MESSAGES.PRODUCT.GET_BY_ID_FAILED,
      500
    );
  }

  const { data: images, error: imageError } = await supabase
    .from("product_images")
    .select("image_url")
    .eq("product_id", productId)
    .order("image_order", { ascending: true });

  if (imageError) {
    return errorResponse(
      imageError.message,
      MESSAGES.PRODUCT.GET_BY_ID_FAILED,
      500
    );
  }

  return successResponse(
    {
      data: {
        ...productData,
        product_images: images,
      },
    },
    MESSAGES.PRODUCT.GET_BY_ID_SUCCESS
  );
}

/**
 * Change product status
 * @param req - Request
 * @param params - Params
 * @returns
 * @author ヤン
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const supabase = await createClient();
  const { status } = await req.json();

  const productId = (await params).productId;

  const { error } = await supabase
    .from("products")
    .update({ is_active: status })
    .eq("product_id", productId);

  if (error)
    return errorResponse(
      error.message,
      MESSAGES.PRODUCT.CHANGE_STATUS_FAILED,
      500
    );

  return successResponse(
    { success: true, message: MESSAGES.PRODUCT.CHANGE_STATUS_SUCCESS },
    MESSAGES.PRODUCT.CHANGE_STATUS_SUCCESS
  );
}
