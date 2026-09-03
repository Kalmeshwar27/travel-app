import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { PageShell } from "../components/layout/PageShell";
import { DestinationFilters } from "../components/destination/DestinationFilters";
import { DestinationGrid } from "../components/destination/DestinationGrid";
import { useDestinations } from "../hooks/useDestinations";

export function Destinations() {
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [region, setRegion] = useState("all");
  const [tag, setTag] = useState("all");

  useEffect(() => {
    const q = params.get("q");
    if (q) setQuery(q);
  }, [params]);

  const results = useDestinations({ query, region, tag });

  function reset() {
    setQuery("");
    setRegion("all");
    setTag("all");
  }

  return (
    <PageShell>
      <h1 className="font-display text-4xl">Explore destinations</h1>
      <p className="mt-2 max-w-xl text-[var(--color-ink-soft)]">
        {results.length} destination{results.length === 1 ? "" : "s"} — filter by region or interest,
        or search for a place.
      </p>

      <div className="my-8 rule pt-8">
        <DestinationFilters
          query={query}
          onQueryChange={setQuery}
          region={region}
          onRegionChange={setRegion}
          tag={tag}
          onTagChange={setTag}
          onReset={reset}
        />
      </div>

      <DestinationGrid destinations={results} onReset={reset} />
    </PageShell>
  );
}
