"use server";

import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { successResponse, errorResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * Get news by id
 * @param req - Request
 * @returns News
 * @author ヤン
 */
export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const id = (await params).id;

  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("news_id", Number(id));

  if (error)
    return errorResponse(error.message, MESSAGES.NEWS.GET_BY_ID_FAILED, 500);

  return successResponse(data, MESSAGES.NEWS.GET_BY_ID_SUCCESS);
}

/**
 * Update news
 * @param req - Request
 * @returns News
 * @author ヤン
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { title, content, date } = await req.json();

  const id = (await params).id;

  const { data, error } = await supabase
    .from("news")
    .update({ title, content, news_date: date })
    .eq("news_id", Number(id));

  if (error)
    return errorResponse(error.message, MESSAGES.NEWS.UPDATE_FAILED, 500);

  return successResponse({ data }, MESSAGES.NEWS.UPDATE_SUCCESS);
}

/**
 * Delete news
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
    .from("news")
    .delete()
    .eq("news_id", Number(id));

  if (error)
    return errorResponse(error.message, MESSAGES.NEWS.DELETE_FAILED, 500);

  return successResponse({
    success: true,
    message: MESSAGES.NEWS.DELETE_SUCCESS,
  });
}
