"use server";

import { NextRequest } from "next/server";

import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";
import { ProductImage } from "@/types/products";

/**
 * Get products
 * @param req - Request
 * @returns Products
 * @author ヤン
 */
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");
  const productName = searchParams.get("productName") || "";
  const status = searchParams.get("status") || "";
  const brand = searchParams.get("brand") || "";

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("products")
    .select(
      `
      *,
      category:categories(name),
      brand:brands(name),
      product_images (
        image_url,
        image_order
      )
      `,
      { count: "exact" }
    )
    .ilike("name", `%${productName}%`)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (status !== "0") {
    query = query.eq("is_active", status === "1");
  }

  if (brand !== "0") {
    query = query.eq("brand_id", brand);
  }

  const { data, error, count } = await query;

  if (error)
    return errorResponse(error.message, MESSAGES.PRODUCT.FETCH_FAILED, 500);

  // Sort product_images by image_order inside each product
  const sortedData = data.map((product) => ({
    ...product,
    product_images: product.product_images?.sort(
      (a: ProductImage, b: ProductImage) => (a.image_order ?? 0) - (b.image_order ?? 0)
    ),
  }));

  return successResponse(
    {
      data: sortedData,
      total: count ?? 0,
      page,
      pageSize,
    },
    MESSAGES.PRODUCT.FETCH_SUCCESS
  );
}

