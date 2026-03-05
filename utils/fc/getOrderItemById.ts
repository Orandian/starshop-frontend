import { api } from "@/lib/api/api.gateway";
import { OrderItem } from "@/types/fc/order.type";

/**
 * for pdf generate in mypage
 */
export const fetchOrderItemsById = async (
  orderId: number
): Promise<OrderItem[]> => {
  const res = await api.get<OrderItem[]>(`/fc/order/${orderId}`);
  return res.data ?? [];
};
