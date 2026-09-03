import { useQuery } from "@tanstack/react-query";
import { searchImages } from "../services/imageApi";

export function useDestinationImages(query, count = 1) {
  return useQuery({
    queryKey: ["images", query, count],
    queryFn: ({ signal }) => searchImages(query, count, { signal }),
    enabled: Boolean(query),
    staleTime: 60 * 60 * 1000,
    retry: 1,
  });
}
