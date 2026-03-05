import { useQuery } from "@tanstack/react-query";
import axios from "axios";

/**
 * Use get recommend products
 * @param productId - Product id
 * @returns
 * @author ヤン
 */
export const useGetRecommendProducts = (productId: number) => {
  return useQuery({
    queryKey: ["recommend-product", productId],
    queryFn: () =>
      axios.get("/api/products/" + productId + "/recommendations"),
    select: (data) => data.data,
  });
};
