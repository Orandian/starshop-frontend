"use server"

import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { successResponse, errorResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * Get faq by id
 * @param req - Request
 * @returns Faq
 * @author ヤン
 */
export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const id = (await params).id;

  const { data, error } = await supabase
    .from("faqs")
    .select("*", { count: "exact" })
    .eq("faqs_id", Number(id));

  if (error)
    return errorResponse(error.message, MESSAGES.FAQ.GET_BY_ID_FAILED, 500);

  return successResponse(data, MESSAGES.FAQ.GET_BY_ID_SUCCESS);
}

/**
 * Update faq
 * @param req - Request
 * @returns Faq
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
    .from("faqs")
    .update({
      question: body.question,
      answer: body.answer,
    })
    .eq("faqs_id", Number(id));

  if (error)
    return errorResponse(error.message, MESSAGES.FAQ.UPDATE_FAILED, 500);

  return successResponse({ data }, MESSAGES.FAQ.UPDATE_SUCCESS);
}

/**
 * Delete faq
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
    .from("faqs")
    .delete()
    .eq("faqs_id", Number(id));

  if (error)
    return errorResponse(error.message, MESSAGES.FAQ.DELETE_FAILED, 500);

  return successResponse({
    success: true,
    message: MESSAGES.FAQ.DELETE_SUCCESS,
  });
}
