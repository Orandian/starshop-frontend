// import { orderStatus } from "@/data/order/indes";
import { apiRoutes } from "@/lib/api/api.route";
import { CSVRow, ImportCSVResponse } from "@/types/admin/csvData.type";
import { AdminConfirmOrderRequest, OrderFilterProps } from "@/types/orders";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";


/**
 * Use get customer order details by id
 * @param orderId - Order id
 * @returns
 * @example
 * const { data, isLoading, error } = useGetOrderSummaryDetailsByOrderId(orderId);
 * @author ヤン
 */
export const useGetOrderSummaryDetailsByOrderId = (orderId: number) => {
  return useQuery({
    queryKey: ["customer-order-details", orderId],
    queryFn: () => apiRoutes.admin.adminOrder.getOrderDetails(orderId),
    enabled: !!orderId || orderId > 0,
    select: (response) => response.data,
  });
};

type UpdateTrackingPayload = {
  orderId: number;
  trackingNumber: string;
  shippingCompany: string;
  shippingDate: string;
  status: string;
};

/**
 * Use update shipping tracking number
 * @param orderId - Order id
 * @param trackingNumber - Tracking number
 * @param shippingCompany - Shipping company
 * @param shippingDate - Shipping date
 * @param status - Order status
 * @returns
 * @example
 * const { mutate, isLoading, error } = useUpdateShippingTrackingNumber(orderId, trackingNumber, shippingCompany);
 * @author ヤン
 */
export const useUpdateShippingTrackingNumber = () => {
  return useMutation({
    mutationFn: ({
      orderId,
      trackingNumber,
      shippingCompany,
      shippingDate,
      status,
    }: UpdateTrackingPayload) =>
      axios.post(`/api/admin/orders/update-tracking`, {
        orderId,
        trackingNumber,
        shippingCompany,
        shippingDate,
        status,
      }),
  });
};

/**
 * Use get order summaries
 * @param page - Page number (default: 1)
 * @param pageSize - Number of records per page (default: 10)
 * @param orderDate - Order date
 * @param customerName - Customer name
 * @param status - Order status
 * @returns Paginated order summaries and total count
 * @author ヤン
 */
export const useGetOrderSummaries = (
  page: number = 1,
  pageSize: number = 10,
  userType: string = "",
  orderId: string = "",
  userName: string = "",
  orderStatus: string = "",
  orderDate: string = "",
  yearMonth: string = "",
) => {
  return useQuery({
    queryKey: [
      "order-summaries",
      page,
      pageSize,
      userType,
      orderId,
      userName,
      orderStatus,
      orderDate,
      yearMonth
      ],
    queryFn: () =>
      apiRoutes.admin.adminOrder.getAllOrderSummaries({
        page,
        pageSize,
        userType,
        orderId,
        userName,
        orderStatus,
        orderDate,
        yearMonth,
      }),
    select: (response) => response.data,
  });
};



/**
 * Use update order status
 * @param orderId - Order id
 * @param status - Order status
 * @returns
 * @example
 * const { mutate, isLoading, error } = useUpdateOrderStatus(orderId, status);
 * @author ヤン
 */
export const useUpdateOrderStatus = () => {
  return useMutation({
    mutationFn: ({
      orderId,
      status,
      notes,
      trackingNumber,
      deliveryCompany,
      shippingDate,
    }: {
      orderId: number;
      status: number;
      notes?: string;
      trackingNumber?: string;
      deliveryCompany?: number;
      shippingDate?: string;
    }) =>
      apiRoutes.admin.adminOrder.updateOrderStatus(
        orderId,
        status,
        notes,
        trackingNumber,
        deliveryCompany,
        shippingDate
      ),
  });
};

/**
 * Confirm order
 * @returns Mutation result
 */
export const useConfirmOrder = () => {
  return useMutation({
    mutationFn: (request: AdminConfirmOrderRequest) =>
      apiRoutes.admin.adminOrder.confirmOrder(request),
  });
};


/**
 * Get Order Period List
 */
export const useGetPeriodList = () => {
  return useQuery({
    queryKey: ["order-period-list"],
    queryFn: () => apiRoutes.admin.adminOrder.getPeriodList(),
    select: (response) => response.data,
  });
}

/**
 * Export order summaries to CSV
 */
export const useExportOrderSummariesToCSV = (filters: OrderFilterProps) => {
  return useMutation<Blob |unknown, Error, void>({
    mutationFn: async () => {
      const response = await apiRoutes.admin.adminOrder.exportOrderSummariesToCSV(filters);
      return response;
    },
  });
}

export const useSendDeliveryInformationMail = (orderId :number) => {
  return useMutation({
    mutationFn: () => apiRoutes.admin.adminOrder.sendDeliveryInformationMail(orderId),
  });
}

export const useSendShippingOrderConfirmationMail = () => {
  return useMutation({
    mutationFn: () => apiRoutes.admin.adminOrder.sendShippingOrderConfirmationMail(),
  });
}

export const useImportCSVData = () => {
  return useMutation<ImportCSVResponse, Error, CSVRow[], unknown>({
    mutationFn: (csvData: CSVRow[]) =>
      apiRoutes.admin.adminOrder.importCSVData({ rows: csvData }),
  });
};
