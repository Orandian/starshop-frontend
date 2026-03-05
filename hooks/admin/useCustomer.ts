import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  NewCustomer,
  UpdateProfile,
  CustomerFilterProps,
  CompanyInfoUpdate,
} from "@/types/customers";
import { apiRoutes } from "@/lib/api/api.route";
import { UserBankUpdate, UserAddressUpdate } from "@/types/fc/user.type";

/**
 * Use customers
 * @param page - Page number
 * @param pageSize - Page size
 * @param searchQuery - Search query for name or email
 * @param status - Customer status
 * @returns
 * @example
 * const { data, isLoading, error } = useCustomers(page, pageSize, searchQuery, status);
 * @author ヤン
 */
export const useCustomers = (
  page: number = 1,
  pageSize: number = 10,
  searchQuery: string = "",
  userType: string = "1",
  bonusType: string = "",
) => {
  return useQuery({
    queryKey: ["customers", page, pageSize, searchQuery, userType, bonusType],
    queryFn: () =>
      apiRoutes.admin.customer.getCustomers(
        page,
        pageSize,
        searchQuery,
        userType,
        bonusType,
      ),
    select: (response) => response?.data,
  });
};

/**
 * Use change customer status
 * @param customerId - Customer id
 * @param status - Customer status
 * @returns
 * @example
 * const { mutate, isLoading, error } = useChangeCustomerStatus(customerId, status);
 * @author ヤン
 */
export const useChangeCustomerStatus = (
  customerId: number | string,
  status: number,
) => {
  return useMutation({
    mutationKey: ["change-status"],
    mutationFn: () =>
      apiRoutes.admin.customer.updateCustomerStatus(customerId, status),
  });
};

/**
 * Use get customer by id
 * @param customerId - Customer id
 * @returns
 * @example
 * const { data, isLoading, error } = useGetCustomerById(customerId);
 * @author ヤン
 */
export const useGetCustomerById = (customerId: string | number) => {
  return useQuery({
    queryKey: ["customer", customerId],
    queryFn: () => apiRoutes.admin.customer.getCustomerById(customerId),
    select: (response) => response.data,
    enabled: !!customerId && customerId !== 0,
  });
};

/**
 * Use get customer address by id
 * @param customerId - Customer id
 * @returns
 * @example
 * const { data, isLoading, error } = useGetCustomerAddressById(customerId);
 * @author ヤン
 */
export const useGetCustomerAddressById = (customerId: string | number) => {
  return useQuery({
    queryKey: ["customer-address", customerId],
    queryFn: () =>
      axios.get("/api/admin/customers/" + customerId + "/addresses"),
    select: (response) => response.data,
    enabled: !!customerId,
  });
};

/**
 * Use get customer orders by id
 * @param customerId - Customer id
 * @returns
 * @example
 * const { data, isLoading, error } = useGetOrderSummaryByCustomerId(customerId);
 * @author ヤン
 */
export const useGetOrderSummaryByCustomerId = (
  customerId: string | number,
  page: number = 1,
  pageSize: number = 10,
) => {
  return useQuery({
    queryKey: ["customer-orders", customerId],
    queryFn: () =>
      axios.get("/api/admin/customers/" + customerId + "/orders", {
        params: { page, pageSize },
      }),
    select: (response) => response.data,
    enabled: !!customerId,
  });
};

//temp function
export const useGetOrderByCustomerId = (
  customerId: string | number,
  page: number = 1,
  pageSize: number = 10,
) => {
  return useQuery({
    queryKey: ["customer-orders", customerId, page, pageSize],
    queryFn: () =>
      apiRoutes.admin.customer.getOrderByCustomerId(customerId, page, pageSize),
    select: (response) => response.data,
    enabled: !!customerId,
  });
};

/**
 * Use create customer
 * @param param0
 * @returns
 * @author Phway
 */
export const useCreateCustomer = () => {
  return useMutation({
    mutationKey: ["customer_create"],
    mutationFn: (data: NewCustomer) =>
      apiRoutes.admin.customer.createCustomer(data),
  });
};

/**
 * Use User Detail Update for Name Section
 * @author Phway
 * @created 2025-12-08
 * @updated ****-**-**
 * @returns Mutation
 */
export const useUserProfileUpdate = (userId: string | number) =>
  useMutation({
    mutationKey: ["user-profile-update-admin"],
    mutationFn: (data: UpdateProfile) =>
      apiRoutes.admin.customer.updateProfile(data, userId),
  });

/**
 * Use User Detail Update for basic info section (only for fc user)
 * @author Phway
 * @created 2025-12-08
 * @updated ****-**-**
 * @returns Mutation
 */
export const useUserCompanyInfoUpdate = (userId: string | number) =>
  useMutation({
    mutationKey: ["user-companyInfo-update-admin"],
    mutationFn: (data: CompanyInfoUpdate) =>
      apiRoutes.admin.customer.updateCompanyInfo(data, userId),
  });

/**
 * Use User Detail Update for bank info section (only for fc user)
 * @author Phway
 * @created 2025-12-08
 * @updated ****-**-**
 * @returns Mutation
 */
export const useUserBankInfoUpdate = (userId: string | number) =>
  useMutation({
    mutationKey: ["user-bankInfo-update-admin"],
    mutationFn: (data: UserBankUpdate) =>
      apiRoutes.admin.customer.updateBankInfo(data, userId),
  });

/**
 * Use User Detail Update for address info section (deli and billing adress)
 * @author Phway
 * @created 2025-12-08
 * @updated ****-**-**
 * @returns Mutation
 */
export const useUserAddressInfoUpdate = (userId: string | number) =>
  useMutation({
    mutationKey: ["user-addressInfo-update-admin"],
    mutationFn: (data: UserAddressUpdate) =>
      apiRoutes.admin.customer.updateAddressInfo(data, userId),
  });

/**
 * get customer's order items by order id
 * @param userId
 * @param orderId
 * @returns
 */
export const useOrderItems = (orderId: number) =>
  useQuery({
    queryKey: ["get-order-items-admin"],
    queryFn: () => apiRoutes.admin.customer.getOrderItemsByOrderId(orderId),
    select: (response) => response?.data,
    enabled: !!orderId,
  });

/**
 * get customer counts
 * @returns
 * @author Phway
 * @created 2025-10-16
 * @updated ****-**-**
 */
export const useGetCounts = () => {
  return useQuery({
    queryKey: ["user-counts-admin"],
    queryFn: () => apiRoutes.admin.customer.getCounts(),
    select: (response) => {
      // Transform array into an object with type as keys
      return response?.data?.reduce(
        (acc: Record<string, number>, item) => {
          acc[item.type] = item.count;
          return acc;
        },
        {} as Record<string, number>,
      );
    },
  });
};

/**
 * Export users to CSV
 * @param filters
 * @returns
 */
export const useExportUsersToCSV = (filters: CustomerFilterProps) => {
  return useMutation<Blob | unknown, Error, void>({
    mutationFn: async () => {
      const response = await apiRoutes.admin.customer.exportUsersToCSV(filters);
      return response;
    },
  });
};

export const useGetAdminConfirmedFcCustomers = (
  page: number = 1,
  pageSize: number = 10,
) => {
  return useQuery({
    queryKey: ["customers", page, pageSize],
    queryFn: () =>
      apiRoutes.admin.customer.getAdminConfirmedFcCustomers(page, pageSize),
    select: (response) => response?.data,
  });
};
