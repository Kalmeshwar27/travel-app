import { useQuery } from "@tanstack/react-query";
import { getCurrentWeather } from "../services/weatherApi";

export function useWeather(lat, lng) {
  return useQuery({
    queryKey: ["weather", lat, lng],
    queryFn: ({ signal }) => getCurrentWeather(lat, lng, { signal }),
    enabled: lat != null && lng != null,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
}
