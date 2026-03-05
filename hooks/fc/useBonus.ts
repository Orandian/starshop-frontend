import { apiRoutes } from "@/lib/api/api.route";
import { useQuery } from "@tanstack/react-query";

export const useBonusPeriod = () =>
  useQuery({
    queryKey: ["get-bonus-period-list"],
    queryFn: () => apiRoutes.fc.bonus.fcGetBonusPeriodList(),
  });

export const useBonusTransactionList = (
  invoiceYearMonth: string | null,
  page = 1,
  size = 10,
  filters: Record<string, number> = {}
) =>
  useQuery({
    queryKey: ["get-bonus-transaction-list", { invoiceYearMonth, page, size, filters }],
    queryFn: () =>
      apiRoutes.fc.bonus.fcGetBonusTransactionList(
        invoiceYearMonth,
        page,
        size,
        filters
      ),
  });

export const useTotalBonusAmount = (invoiceYearMonth: string | null) =>
  useQuery({
    queryKey: ["get-total-bonus-amount", { invoiceYearMonth }],
    queryFn: () => apiRoutes.fc.bonus.fcGetTotalBonusAmount(invoiceYearMonth),
  });

/**
 * fetch invoice data by yearMonth
 */
export const useInvoiceData = (invoiceYearMonth: string | null) =>
  useQuery({
    queryKey: ["get-invoice-data", { invoiceYearMonth }],
    queryFn: () => apiRoutes.fc.bonus.fcGetInvoiceData(invoiceYearMonth),
    enabled: !!invoiceYearMonth && invoiceYearMonth !== "all",
    select: (response) => response?.data,
  });
