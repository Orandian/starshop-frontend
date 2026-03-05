import { apiRoutes } from "@/lib/api/api.route";
import { useQuery } from "@tanstack/react-query";

export const useGetUserById = (userId: string | number) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => apiRoutes.user.getUserById(userId),
    select: (response) => response.data,
    enabled: !!userId && userId !== 0,
  });
};
