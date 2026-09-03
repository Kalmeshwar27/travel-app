import { useMemo } from "react";
import { destinations } from "../data/destinations";

export function useDestinations({ query = "", region = "all", tag = "all" } = {}) {
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    return destinations.filter((d) => {
      const matchesQuery =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q));
      const matchesRegion = region === "all" || d.region === region;
      const matchesTag = tag === "all" || d.tags.includes(tag);
      return matchesQuery && matchesRegion && matchesTag;
    });
  }, [query, region, tag]);
}
