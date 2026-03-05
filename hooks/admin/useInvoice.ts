import { apiRoutes } from "@/lib/api/api.route";
import { InvoiceFiltersProps } from "@/types/invoices";
import { useMutation, useQuery } from "@tanstack/react-query";

/**
 * Use get invoice
 * @param userType
 * @param page
 * @param size
 * @returns
 * @author Phway
 */
export const useGetInvoice = (
  userType: string = "general",
  page: number = 1, 
  size: number = 10,
  orderId: string = "",
  userName: string = "",
  invoiceStatus: string = "",
  orderDate: string = ""
) => {
  return useQuery({
    queryKey: [
      "invoice",
      userType,
      page,
      size,
      orderId,
      userName,
      invoiceStatus,
      orderDate,
    ],
    queryFn: () =>
      apiRoutes.admin.invoice.adminGetInvoiceByUserType(userType, page, size, orderId, userName, invoiceStatus, orderDate),
    select: (response) => ({
      data: response?.data?.data,
      pagination: response?.data?.pagination,
      extra: response?.data?.extra,
    }),
  });
};

/**
 * Use change invoice status
 * @param inoiveId
 * @param status
 * @param userType
 * @returns
 * @author Phway
 */
export const useChangeStatus = (
  invoiceId: number,
  status: number,
  userType: string
) => {
  return useMutation({
    mutationKey: ["change-inoice-status"],
    mutationFn: () =>
      apiRoutes.admin.invoice.updateStatus(invoiceId, status, userType),
  });
};

/**
 * Export to csv
 *
 */
export const useExportToCSV = (filters: InvoiceFiltersProps) => {
  return useMutation<Blob | unknown, Error, void>({
    mutationFn: async () => {
      const response = await apiRoutes.admin.invoice.exportToCSV(filters);
      return response;
    },
  });
};
