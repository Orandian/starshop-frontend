import { fcRoutes } from "@/lib/api/routes/fc.route";
import { useQuery } from "@tanstack/react-query";

export const useGetFcSettng = () =>
  useQuery({
    queryKey: ["get-fc-setting"],
    queryFn: () => fcRoutes.fcSetting.fcGetSetting(),
  });

export const useGetCalculationShippingCost = (params: {
  prefecture: string;
  quantity: number;
}) =>
  useQuery({
    queryKey: [
      "get-calculation-shipping-cost",
      params.prefecture,
      params.quantity,
    ],
    queryFn: () => fcRoutes.fcSetting.fcGetCalculationShippingCost(params),
    enabled: !!params?.prefecture || !!params?.quantity,
  });
