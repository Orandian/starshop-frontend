import { apiRoutes } from "@/lib/api/api.route";
import { useQuery } from "@tanstack/react-query";

export const usePlusPlan = () =>
  useQuery({
    queryKey: ["plus-plan"],
    queryFn: () => apiRoutes.fc.planStatus.fcGetPlanStatus(),
  });


export const useGetAllPlan = () =>
  useQuery({
    queryKey: ["all-plan"],
    queryFn: () => apiRoutes.fc.planStatus.fcGetAllPlan(),
  });