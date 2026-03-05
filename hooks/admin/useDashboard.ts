import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { apiRoutes } from "@/lib/api/api.route";

/**
 * Use chart data
 * @returns Chart data
 * @author ヤン
 */
export const useChartData = ({
  fromDate,
  toDate,
}: {
  fromDate: string;
  toDate: string;
}) => {
  return useQuery({
    queryKey: ["chart-data", fromDate, toDate],
    queryFn: () =>
      axios.post("/api/admin/dashboard/chart", { fromDate, toDate }),
    select: (response) => response.data,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Use dashboard summary
 * @returns Dashboard summary
 * @author ヤン
 */
export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: () => axios.get("/api/admin/dashboard/summary"),
    select: (response) => response.data,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Use top products
 * @returns Top products
 * @author ヤン
 */
export const useTopProducts = ({
  fromDate,
  toDate,
}: {
  fromDate: string;
  toDate: string;
}) => {
  return useQuery({
    queryKey: ["top-products", fromDate, toDate],
    queryFn: () =>
      axios.post("/api/admin/dashboard/top-products", {
        fromDate,
        toDate,
      }),
    select: (response) => response.data,
  });
};

export const useOrder = (
  page: number,
  size: number,
  type: number,
) =>
  useQuery({
    queryKey: ["get-orders", { page, size,type }],
    queryFn: () => apiRoutes.admin.dashboard.adminGetOrders(page, size,type),
  });

  export const useOrderCountByType = () =>
    useQuery({
      queryKey: ["get-orders-count-by-type"],
      queryFn: () =>
        apiRoutes.admin.dashboard.adminGetOrderCountByType(),
    });

export const useOrderTotalCount = () =>
  useQuery({
    queryKey: ["get-orders-total-count"],
    queryFn: () => apiRoutes.admin.dashboard.adminGetAllOrdersCount(),
  });

export const useCustomerTotalCount = () =>
  useQuery({
    queryKey: ["get-users-total-count"],
    queryFn: () => apiRoutes.admin.dashboard.adminGetAllCustomerCount(),
  });

export const useProductTotalCount = () =>
  useQuery({
    queryKey: ["get-product-total-count"],
    queryFn: () => apiRoutes.admin.dashboard.adminGetAllProductCount(),
  });


export const useThisMonthSalesTotal = () =>
  useQuery({
    queryKey: ["get-this-month-sales-total"],
    queryFn: () => apiRoutes.admin.dashboard.adminThisMonthSalesTotal(),
  });

export const useYearlySalesTotal = () =>
  useQuery({
    queryKey: ["get-yearly-sales-total"],
    queryFn: () => apiRoutes.admin.dashboard.adminYearlySalesTotal(),
  });

  export const useDateRangeSalesTotal = (fromDate: string, toDate: string) =>
  useQuery({
    queryKey: ["get-date-range-sales-total", { fromDate, toDate }],
    queryFn: () =>
      apiRoutes.admin.dashboard.adminDateRangeSalesTotal({ fromDate, toDate }),
  });

export const useFcTotal = () =>
  useQuery({
    queryKey: ["get-fc-totals"],
    queryFn: () => apiRoutes.admin.dashboard.adminFcTotal(),
  });

export const useAdminActivity = (page: number = 1, size: number = 10) =>
  useQuery({
    queryKey: ["get-admin-activities", page, size],
    queryFn: () => apiRoutes.admin.dashboard.adminActivity(page, size),
    select: (response) => response.data,
  }); 

export const useStatistic = () =>
  useQuery({
    queryKey: ["get-statistic"],
    queryFn: () => apiRoutes.admin.dashboard.adminGetStatistics(),
  });
