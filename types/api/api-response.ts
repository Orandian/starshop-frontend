/**
 * API応答の型定義
 * @author ヤン
 */
export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
};
