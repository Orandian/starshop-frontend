import { useQuery } from "@tanstack/react-query";
import { apiRoutes } from "@/lib/api/api.route";

/**
 * Use purchase types
 * @returns
 * @author ヤン
 */
export const usePurchaseTypes = () => {
    return useQuery({
      queryKey: ["purchase-types"],
      queryFn: () => apiRoutes.user.purchaseTypes(),
    });
  };
