import { useQuery } from "@tanstack/react-query";
import { searchVideo } from "../services/videoApi";

export function useHeroVideo(query = "mountain valley aerial travel") {
  return useQuery({
    queryKey: ["hero-video", query],
    queryFn: ({ signal }) => searchVideo(query, { signal }),
    staleTime: 60 * 60 * 1000,
    retry: 1,
  });
}