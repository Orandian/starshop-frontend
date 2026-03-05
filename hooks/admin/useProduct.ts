import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRoutes } from "@/lib/api/api.route";
import {
  CreateProduct,
  UpdateProductRequest,
} from "@/types/dashboard/products";

/**
 * Use products
 * @param page - Page number
 * @param pageSize - Page size
 * @param productName - Product name
 * @param status - Product status
 * @returns
 * @example
 * const { data, isLoading, error } = useProducts();
 * @author ヤン
 */
export const useProducts = (
  page: number = 1,
  pageSize: number = 10,
  productName: string = "",
  status: string = "",
  brandId: string = "",
) => {
  return useQuery({
    queryKey: ["products", page, pageSize, productName, status, brandId],
    queryFn: () =>
      apiRoutes.admin.product.getAllProducts({
        page,
        pageSize,
        productName,
        status,
        brandId,
      }),
    select: (data) => data.data,
  });
};

/**
 * Use product by id
 * @param productId - Product id
 * @returns
 * @example
 * const { data, isLoading, error } = useProductById(productId);
 * @author ヤン
 */
export const useProductById = (productId: number) => {
  return useQuery({
    queryKey: ["productById", productId],
    queryFn: () => apiRoutes.admin.product.getProductById(productId),
    enabled: !!productId,
    select: (response) => response.data,
  });
};

/**
 * Use change product status
 * @param productId - Product id
 * @param status - Product status
 * @returns
 * @example
 * const { mutate, isLoading, error } = useChangeProductStatus(productId, status);
 * @author ヤン
 */
export const useChangeProductStatus = (productId: number, status: boolean) => {
  return useMutation({
    mutationFn: () =>
      apiRoutes.admin.product.changeProductStatus({ status, productId }),
  });
};

/**
 * Use create product
 * @param product - Product
 * @param recommendProducts - Recommend products
 * @returns
 * @example
 * const { mutate, isLoading, error } = useCreateProduct({ product, recommendProducts });
 * @author ヤン
 */
export const useCreateProduct = () => {
  return useMutation({
    mutationFn: ({
      product,
      recommendProducts,
    }: {
      product: CreateProduct;
      recommendProducts: number[];
    }) => apiRoutes.admin.product.createProduct({ product, recommendProducts }),
  });
};

/**
 * Use update product
 * @param product - Product
 * @param recommendProducts - Recommended product IDs (optional)
 * @returns
 * @example
 * const { mutate, isLoading, error } = useUpdateProduct();
 * @author ヤン
 */
export const useUpdateProduct = () => {
  return useMutation({
    mutationFn: ({
      productId,
      product,
      recommendProducts,
    }: {
      productId: number;
      product: UpdateProductRequest;
      recommendProducts?: number[];
    }) =>
      apiRoutes.admin.product.updateProduct({
        productId,
        product,
        recommendProducts,
      }),
  });
};

export const useUpdateRankingAndArrival = () => {
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { ranking?: number; isNewArrival?: boolean };
    }) => apiRoutes.admin.product.updateProductRankingAndArrival(id, data),
  });
};

export const useGetAllProductsForExport = (filter: {
  productName: string;
  status: string;
  brandId: string;
}) =>
  useMutation({
    mutationKey: ["export-all-products-csv"],
    mutationFn: async () =>
      await apiRoutes.admin.product.exportAllProductsToCSV(filter),
  });

export const useGetAdminProfit = (
  page: number,
  size: number,
  filter: { yearMonth?: string },
) => {
  return useQuery({
    queryKey: ["admin-profit", page, size, filter],
    queryFn: () => apiRoutes.admin.product.getAdminProfit(page, size, filter),
    select: (data) => data.data,
  });
};

export const useGetAdminProfilePeriod = () => {
  return useQuery({
    queryKey: ["admin-profile-period"],
    queryFn: () => apiRoutes.admin.product.getAdminProfilePeriod(),
  });
};
