"use server"

import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { successResponse, errorResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * Get brand by id
 * @param req - Request
 * @returns Brand
 * @author ヤン
 */
export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const id = (await params).id;

  const { data, error } = await supabase
    .from("brands")
    .select("*", { count: "exact" })
    .eq("brand_id", Number(id));

  if (error)
    return errorResponse(error.message, MESSAGES.BRAND.GET_BY_ID_FAILED, 500);

  return successResponse(data, MESSAGES.BRAND.GET_BY_ID_SUCCESS);
}

/**
 * Update brand
 * @param req - Request
 * @returns Brand
 * @author ヤン
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const body = await req.json();

  const id = (await params).id;

  const { data, error } = await supabase
    .from("brands")
    .update({
      name: body.name,
    })
    .eq("brand_id", Number(id));

  if (error)
    return errorResponse(error.message, MESSAGES.BRAND.UPDATE_FAILED, 500);

  return successResponse({ data }, MESSAGES.BRAND.UPDATE_SUCCESS);
}

/**
 * Delete brand
 * @param req - Request
 * @returns
 * @author ヤン
 */
export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();

  const id = (await params).id;

  const { error } = await supabase
    .from("brands")
    .delete()
    .eq("brand_id", Number(id));

  if (error)
    return errorResponse(error.message, MESSAGES.BRAND.DELETE_FAILED, 500);

  return successResponse({
    success: true,
    message: MESSAGES.BRAND.DELETE_SUCCESS,
  });
}
