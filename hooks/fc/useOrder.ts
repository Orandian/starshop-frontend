import { apiRoutes } from "@/lib/api/api.route";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useOrder = (
  page: number,
  size: number,
  search?: string,
  orderDate?: string,
  status?: number,
  date?: string | null,
) =>
  useQuery({
    queryKey: ["get-orders", { page, size, search, orderDate, status }, date],
    queryFn: () =>
      apiRoutes.fc.order.fcGetOrders(
        page,
        size,
        { search, orderDate, status },
        date,
      ),
  });

export const useOrderItems = (orderId: number) =>
  useQuery({
    queryKey: ["get-order-items"],
    queryFn: () => apiRoutes.fc.order.fcGetOrderItems(orderId),
    enabled: !!orderId,
  });

export const useRemoveOrderItem = () =>
  useMutation({
    mutationKey: ["remove-order-item"],
    mutationFn: (orderId: number) =>
      apiRoutes.fc.order.fcRemoveOrderItem(orderId),
  });

export const useOrderPeriodLists = () =>
  useQuery({
    queryKey: ["get-order-period-lists"],
    queryFn: () => apiRoutes.fc.order.fcOrderPeroidLists(),
  });

export const useGetAllOrderAmount = () =>
  useQuery({
    queryKey: ["get-all-order-amount"],
    queryFn: () => apiRoutes.fc.order.fcGetAllOrderAmount(),
  });

/**
 * fc upload hook
 * @returns
 */
export const useUploadPdf = () =>
  useMutation({
    mutationKey: ["upload-pdf"],
    mutationFn: async ({
      pdfBlob,
      fileName,
    }: {
      pdfBlob: Blob;
      fileName: string;
    }) => {
      const result = await apiRoutes.fc.order.fcUploadPdf(pdfBlob, fileName);
      return result;
    },
  });

/**
 * fetch invoice id
 */
export const useGetPreInvoiceId = () =>
  useQuery({
    queryKey: ["get-pre-invoice-id"],
    queryFn: () => apiRoutes.fc.order.fcPreInvoiceId(),
  });
