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
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "10");
  const productName = searchParams.get("productName") ?? "";
  const status = searchParams.get("status") ?? "";

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("products")
    .select(`*, category:categories(name), product_images(image_url, image_order)`, {
      count: "exact",
    })
    .ilike("name", `%${productName}%`)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (status !== "0") {
    query = query.eq("is_active", status === "1");
  }

  const { data, error, count } = await query;

  if (error) {
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      error.message || MESSAGES.PRODUCT.FETCH_FAILED,
      500
    );
  }

  return successResponse({
    data,
    total: count ?? 0,
    page,
    pageSize,
  }, MESSAGES.PRODUCT.FETCH_SUCCESS);
}