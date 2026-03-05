import { NextResponse } from "next/server";
import { ApiResponse } from "@/types/api/api-response";

/**
 * この関数は成功応答を返します。
 * @param data - 返されるデータ。
 * @param message - 返されるメッセージ。
 * @param status - HTTPステータスコード。
 * @returns 成功応答。
 * @author ヤン
 */
export const successResponse = <T>(
  data: T,
  message: string = "Success",
  status = 200
) => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  return NextResponse.json(response, { status });
};

/**
 * この関数は失敗応答を返します。
 * @param error - 返されるエラーメッセージ。
 * @param message - 返されるメッセージ。
 * @param status - HTTPステータスコード。
 * @returns 失敗応答。
 * @author ヤン
 */
export const errorResponse = (
  error: string,
  message: string = "Error",
  status = 400
) => {
  const response: ApiResponse<null> = {
    success: false,
    message,
    error,
  };
  return NextResponse.json(response, { status });
};
