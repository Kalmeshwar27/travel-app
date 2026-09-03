import { useQuery } from "@tanstack/react-query";
import { searchLocations } from "../services/geocodingApi";
import { useDebounce } from "./useDebounce";

export function useLocationSearch(query) {
  const debounced = useDebounce(query, 350);
  return useQuery({
    queryKey: ["geocode", debounced],
    queryFn: ({ signal }) => searchLocations(debounced, { signal }),
    enabled: debounced.trim().length >= 2,
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });
}
