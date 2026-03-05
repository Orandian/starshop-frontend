import { useQuery } from "@tanstack/react-query";
import { fetchWeatherByCity } from "@/lib/api/weatherService";

export const useWeatherCity = (city: string) => {
  return useQuery({
    queryKey: ["weather", city],
    queryFn: () => fetchWeatherByCity(city),
    enabled: !!city,
    staleTime: 1000 * 60 * 5,
  });
};