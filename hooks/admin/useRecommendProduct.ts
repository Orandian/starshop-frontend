import { useQuery } from "@tanstack/react-query";
import { apiRoutes } from "@/lib/api/api.route";

/**
 * Use get recommend products to choose
 * @param productId - Product id (optional) - if provided, this product will be excluded from recommendations
 * @returns
 * @example
 * const { data, isLoading, error } = useGetRecommendProductsToChoose();
 * const { data, isLoading, error } = useGetRecommendProductsToChoose(productId);
 * @author ヤン
 */
export const useGetRecommendProductsToChoose = (productId?: number) => {
  return useQuery({
    queryKey: ["recommendProductsToChoose", productId],
    queryFn: () => apiRoutes.admin.product.getRecommendProductsToChoose(productId),
    select: (response) => response.data,
  });
};

/**
 * Use get recommend products
 * @param productId - Product id
 * @returns
 * @example
 * const { data, isLoading, error } = useGetRecommendProducts(productId);
 * @author ヤン
 */
export const useGetRecommendProducts = (productId?: number) => {
  return useQuery({
    queryKey: ["recommendProducts", productId],
    queryFn: () => apiRoutes.admin.product.getRecommendProductsToChoose(productId),
    select: (response) => response.data,
    enabled: !!productId,
  });
};
