import { apiRoutes } from "@/lib/api/api.route";
import { useQuery } from "@tanstack/react-query";

export const useProductPopular = () =>
  useQuery({
    queryKey: ["get-popular-products"],
    queryFn: () => apiRoutes.fc.product.fcGetPopularProducts(),
  });
