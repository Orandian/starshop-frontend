import { apiRoutes } from "@/lib/api/api.route";
import { useQuery } from "@tanstack/react-query";

/**
 * Use brands
 * @returns
 * @author ヤン
 */
// export const useBrands = () => {
//   return useQuery({
//     queryKey: ["brands"],
//     queryFn: async () => {
//       const res = await axios.get("/api/brands");
//       return res.data;
//     },
//     staleTime: 1000 * 60 * 5,
//   });
// };

export const usePublicBrands = () => {
  return useQuery({
    queryKey: ["brands-public"],
    queryFn:  async () => {
      return await apiRoutes.public.brands();
    },
  });
};
