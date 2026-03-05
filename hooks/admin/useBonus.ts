import { apiRoutes } from "@/lib/api/api.route";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useBonusPeriod = () =>
  useQuery({
    queryKey: ["get-bonus-period-list"],
    queryFn: () => apiRoutes.admin.bonus.adminGetBonusPeriodList(),
  });

export const useBonusTransactionList = (
  invoiceYearMonth: string | null,
  page = 1,
  size = 10,
) =>
  useQuery({
    queryKey: ["get-bonus-transaction-list", { invoiceYearMonth, page, size }],
    queryFn: () =>
      apiRoutes.admin.bonus.adminGetBonusTransactionList(
        invoiceYearMonth,
        page,
        size,
      ),
  });

export const useBonusTransactionListByUser = (
  userId: number,
  invoiceYearMonth: string | null,
  page = 1,
  size = 10,
) =>
  useQuery({
    queryKey: [
      "get-bonus-transaction-list-user",
      { userId, invoiceYearMonth, page, size },
    ],
    queryFn: () =>
      apiRoutes.admin.bonus.adminGetBonusTransactionListByUser(
        userId,
        invoiceYearMonth,
        page,
        size,
      ),
  });

export const useBonusDashboardTransactionList = (
  invoiceYearMonth: string | null,
  page = 1,
  size = 10,
) =>
  useQuery({
    queryKey: ["get-bonus-transaction-list", { invoiceYearMonth, page, size }],
    queryFn: () =>
      apiRoutes.admin.dashboard.adminGetBonusTransactionList(
        invoiceYearMonth,
        page,
        size,
      ),
  });

export const useTotalBonusAmount = (
  invoiceYearMonth: string | null,
  userId: number,
) =>
  useQuery({
    queryKey: ["get-total-bonus-amount", { invoiceYearMonth, userId }],
    queryFn: () =>
      apiRoutes.admin.bonus.adminGetTotalBonusAmount(invoiceYearMonth, userId),
  });

export const useGetAllMemeberBonus = (
  enable: boolean,
  filter: {
    yearMonth: string;
  },
  page: number,
  size: number,
) =>
  useQuery({
    queryKey: ["get-all-member-bonus", filter, page, size],
    queryFn: () =>
      apiRoutes.admin.bonus.adminGetAllMemeberBonus(filter, page, size),
    enabled: enable,
  });

export const useGetMemberBonusById = (enabled: boolean, id: number) =>
  useQuery({
    queryKey: ["get-member-bonus-by-id", id],
    queryFn: () => apiRoutes.admin.bonus.adminGetMemberBonusById(id),
    enabled: enabled,
  });

export const useGetAllAdminBonus = (
  enable: boolean,
  filter: {
    yearMonth: string;
  },
  page: number,
  size: number,
) =>
  useQuery({
    queryKey: ["get-all-admin-bonus", filter, page, size],
    queryFn: () =>
      apiRoutes.admin.bonus.adminGetAllAdminBonus(filter, page, size),
    enabled: enable,
  });

export const useGetAllBonus = (
  enable: boolean,
  filter: {
    yearMonth: string;
  },
  page: number,
  size: number,
) =>
  useQuery({
    queryKey: ["get-all-bonus", filter, page, size],
    queryFn: () => apiRoutes.admin.bonus.adminGetAllBonus(filter, page, size),
    enabled: enable,
  });

export const useGetAdminBonusById = (enabled: boolean, id: number) =>
  useQuery({
    queryKey: ["get-admin-bonus-by-id", id],
    queryFn: () => apiRoutes.admin.bonus.adminGetAdminBonusById(id),
    enabled: enabled,
  });

export const useGetTimePeriodById = (id: number) =>
  useQuery({
    queryKey: ["get-time-period-by-id", id],
    queryFn: () => apiRoutes.admin.bonus.adminGetTimePeriodById(id),
    select: (data) => data.data,
  });

export const useUpdatePaymentActivate = () =>
  useMutation({
    mutationFn: ({ yearMonth, fcId }: { yearMonth: string; fcId: number }) =>
      apiRoutes.admin.bonus.adminPaymentActivate(yearMonth, fcId),
  });
