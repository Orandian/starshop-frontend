import { useMutation, useQuery } from "@tanstack/react-query";
import { OrderItemCreate } from "@/types/orders";
import axios from "axios";
import { apiRoutes } from "@/lib/api/api.route";
import { UserCheckoutIntentRequest } from "@/types/cart";

/**
 * Get order summaries
 * @param page - Page number (default: 1)
 * @param pageSize - Number of records per page (default: 10)
 * @param orderDate - Order date
 * @param status - Order status
 * @returns Paginated order summaries and total count
 * @author ヤン
 */
export const useGetOrderSummaries = (
  page: number = 1,
  pageSize: number = 10,
  orderDate: string = "",
  status: string = "all",
) => {
  return useQuery({
    queryKey: ["order-summaries", page, pageSize, orderDate, status],
    queryFn: () =>
      axios.get("/api/user/orders/summary", {
        params: { page, pageSize, orderDate, status },
      }),
    select: (response) => response.data,
  });
};

/**
 * Create order
 * @param order - Order object
 * @returns Created order
 * @author ヤン
 */
export const useCreateOrder = () => {
  return useMutation({
    mutationFn: ({ sessionId }: { sessionId: string }) =>
      apiRoutes.user.paymentSuccess(sessionId),
  });
};

/**
 * Create order item
 * @param orderItem - Order item object
 * @returns Created order item
 * @author ヤン
 */
export const useCreateOrderItem = () => {
  return useMutation({
    mutationFn: (orderItem: OrderItemCreate[]) =>
      axios.post("/api/user/orders/item", orderItem),
  });
};

/**
 * Get customer order details by id
 * @param orderId - Order id
 * @returns Customer order details
 * @author ヤン
 */
export const useGetOrderSummaryDetailsByOrderId = (orderId: number) => {
  return useQuery({
    queryKey: ["order-summary-details", orderId],
    queryFn: () => apiRoutes.user.userOrderDetails(orderId),
    enabled: !!orderId,
    select: (response) => response.data,
  });
};

interface UpdateOrderStatusParams {
  orderId: number;
  notes: string;
}

/**
 * Update order status
 * @param params - Update order status params
 * @returns Updated order details
 * @author ヤン
 */
export const useUpdateOrderStatus = () => {
  return useMutation({
    mutationFn: (params: UpdateOrderStatusParams) =>
      apiRoutes.user.userCancelOrder(params.orderId, params.notes),
  });
};

export const useUserCheckoutIntent = () =>
  useMutation({
    mutationKey: ["user-checkout-intent"],
    mutationFn: (payload: UserCheckoutIntentRequest) =>
      apiRoutes.user.userCheckIntent(payload),
  });

export const useGetUserOrderReceipt = (orderId: string) => {
  return useQuery({
    queryKey: ["user-orders", orderId],
    queryFn: () => apiRoutes.user.useOrderReceipt(orderId),
    enabled: !!orderId,
    select: (response) => response.data,
  });
};

/**
 * user upload hook for receiptPDF
 * @returns
 */
export const useUploadPdf = () =>
  useMutation({
    mutationKey: ["user-upload-pdf"],
    mutationFn: async ({
      pdfBlob,
      fileName,
    }: {
      pdfBlob: Blob;
      fileName: string;
    }) => {
      const result = await apiRoutes.user.userUploadPdf(pdfBlob, fileName);
      return result;
    },
  });

/**
 * fetch invoice id
 */
export const useGetPreReceiptId = () =>
  useQuery({
    queryKey: ["get-pre-receipt-id"],
    queryFn: () => apiRoutes.user.userPreReceiptId(),
  });
