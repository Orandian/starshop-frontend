"use server";

import { NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";
import { createOrderMail } from "@/lib/api/user/createOrderMailService";

/**
 * Send order mail to user
 * @param req - Request
 * @returns
 * @author ヤン
 */
export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-internal-secret");
  const envSecret = "NhyujmKi987$#";

  if (secret !== envSecret) {
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      "Unauthorized access",
      401
    );
  }

  const { email, orderId, username, total, products } = await req.json();

  if (!orderId || !username || !total || !products) {
    return errorResponse(MESSAGES.COMMON.ERROR, MESSAGES.COMMON.ERROR, 400);
  }

  try {
    const res = await createOrderMail({
      email,
      orderId,
      username,
      total,
      products,
    });

    if (res.success) {
      return successResponse(
        {
          success: true,
          message: MESSAGES.COMMON.SUCCESS,
        },
        MESSAGES.COMMON.SUCCESS
      );
    } else {
      return errorResponse(MESSAGES.COMMON.ERROR, res.message, 500);
    }
  } catch (error) {
    console.error("Failed to send mail:", error);
    return errorResponse(MESSAGES.COMMON.ERROR, "Failed to send mail", 500);
  }
}
