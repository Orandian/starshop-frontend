import { apiRoutes } from "@/lib/api/api.route";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

/**
 * Use top products
 * @param page - Page number
 * @param pageSize - Page size
 * @param productName - Product name
 * @param status - Product status
 * @returns
 * @example
 * const { data, isLoading, error } = useTopProducts();
 * @author ヤン
 */
// export const useTopProducts = (
//   page: number = 1,
//   pageSize: number = 9,
//   productName: string = "",
//   status: string = "1"
// ) => {
//   return useQuery({
//     queryKey: ["top-products", page, pageSize, productName, status],
//     queryFn: () =>
//       axios.get("/api/products", {
//         params: {
//           page,
//           pageSize,
//           productName,
//           status,
//         },
//       }),
//     select: (data) => data.data,
//   });
// };

/**
 * Use products by category
 * @param category_id - Category id
 * @returns
 * @example
 * const { data, isLoading, error } = useProductsByCategory();
 * @author ヤン
 */
// export const useProductsByCategory = (
//   category_id: string = "all",
//   brand_id: string = "all"
// ) => {
//   return useQuery({
//     queryKey: ["products-by-category", category_id, brand_id],
//     queryFn: () =>
//       axios.get("/api/products/by-category", {
//         params: {
//           category_id,
//           brand_id,
//         },
//       }),
//     select: (data) => data.data,
//   });
// };

/**
 * Use product detail
 * @param productId - Product id
 * @returns
 * @example
 * const { data, isLoading, error } = useProductDetail();
 * @author ヤン
 */
// export const useProductDetail = (productId: number) => {
//   return useQuery({
//     queryKey: ["product-detail", productId],
//     queryFn: async () => {
//       return await apiRoutes.public.productDetail(productId);
//     },
//     enabled: !!productId,
//   });
// };

export const usePublicProductsDetails = (productId?: number) => {
  return useQuery({
    queryKey: ["products-details-public", productId],
    queryFn: async () => {
      return await apiRoutes.public.productDetail(productId || 0);
    },
    enabled: !!productId,
  });
};

export const usePublicProductsList = (brandId?: string, page: number = 1, pageSize: number = 20) => {
  if (!brandId) brandId = "All";
  const brandName = brandId === "all" ? "All" : brandId;
  return useQuery({
    queryKey: ["products-public", brandId, page, pageSize],
    queryFn: async () =>
    await apiRoutes.public.products(brandName, page, pageSize),
    enabled: !!brandId,
  });
};

export const usePublicNewArrivalProductsList =  () => {
  return useQuery({
    queryKey: ["new-arrivals-products-public"],
    queryFn:  async () => {
      return await apiRoutes.public.newArrivalProducts();
  },
  });
};

export const usePublicRankingProductsList =  () => {
  return useQuery({
    queryKey: ["ranking-products-public"],
    queryFn:  async () => {
      return await apiRoutes.public.productRankings();
  },
  });
};

export const usePublicCouponList =  () => {
  return useQuery({
    queryKey: ["compon-list-public"],
    queryFn:  async () => {
      return await apiRoutes.public.coupons();
  },
  });
};

/**
 * Use popular products
 * @returns
 * @author Linn Ko Ko
 */
export const usePopularProducts = () => {
  return useQuery({
    queryKey: ["popular-products"],
    queryFn: () => apiRoutes.fc.product.fcGetPopularProducts(),
  });
}
