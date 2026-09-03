import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { MapPin, Search } from "lucide-react";
import { destinations } from "../data/destinations";
import { DestinationCard } from "../components/destination/DestinationCard";
import { Button } from "../components/common/Common";
import { PageShell } from "../components/layout/PageShell";
import { useGeolocation } from "../hooks/useGeolocation";
import { useLocationSearch } from "../hooks/useLocationSearch";

export function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { location, status, requestLocation, setManualLocation } = useGeolocation();
  const { data: suggestions = [] } = useLocationSearch(query);

  function handleExplore(e) {
    e.preventDefault();
    navigate(`/destinations?q=${encodeURIComponent(query)}`);
  }

  return (
    <>
      <section className="relative flex min-h-[88vh] items-end overflow-hidden bg-[var(--color-night)] text-[var(--color-paper)]">
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-60"
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=1600&q=60"
        >
          <source
            src="https://cdn.coverr.co/videos/coverr-flying-over-mountains-1584/1080p.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-night)] via-[var(--color-night)]/40 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16">
          <p className="coord text-[var(--color-paper)]/70">A field guide to the world</p>
          <h1 className="mt-3 max-w-2xl font-display text-5xl leading-[1.05] sm:text-6xl">
            Know a place before you land in it.
          </h1>
          <p className="mt-4 max-w-md text-[var(--color-paper)]/80">
            Browse destinations, check the weather as it stands right now, and let an assistant turn
            your questions into a day-by-day plan.
          </p>

          <form onSubmit={handleExplore} className="relative mt-8 max-w-md" role="search">
            <label htmlFor="home-search" className="sr-only">
              Search destinations
            </label>
            <div className="flex items-center gap-2 border border-[var(--color-paper)]/40 bg-[var(--color-night)]/60 px-4 py-3 backdrop-blur">
              <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
              <input
                id="home-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search a destination or interest"
                className="w-full bg-transparent outline-none placeholder:text-[var(--color-paper)]/50"
              />
            </div>
            <Button type="submit" variant="route" className="mt-3">
              Explore destinations
            </Button>
          </form>

          <LocationRow
            location={location}
            status={status}
            onRequest={requestLocation}
            onPick={setManualLocation}
            suggestions={suggestions}
          />
        </div>
      </section>

      <PageShell>
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-3xl">Featured destinations</h2>
          <Button as="a" href="/destinations" variant="ghost">
            View all →
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.slice(0, 3).map((d, i) => (
            <DestinationCard key={d.id} destination={d} featured={i === 0} />
          ))}
        </div>
      </PageShell>
    </>
  );
}

function LocationRow({ location, status, onRequest, onPick, suggestions }) {
  const [manualQuery, setManualQuery] = useState("");

  return (
    <div className="mt-6 flex flex-col gap-2 text-sm text-[var(--color-paper)]/80">
      {location ? (
        <p className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4" aria-hidden="true" /> Showing weather near {location.label}
        </p>
      ) : (
        <button type="button" onClick={onRequest} className="flex w-fit items-center gap-1.5 underline underline-offset-4">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          {status === "requesting" ? "Locating…" : "Use my location"}
        </button>
      )}

      {status === "denied" && (
        <p className="coord text-[var(--color-paper)]/60">
          Location was denied — search for a city instead and we'll use that.
        </p>
      )}

      {(!location || status === "denied") && (
        <div className="relative max-w-xs">
          <input
            type="search"
            value={manualQuery}
            onChange={(e) => setManualQuery(e.target.value)}
            placeholder="Or type a city"
            className="w-full border-b border-[var(--color-paper)]/40 bg-transparent py-1 outline-none placeholder:text-[var(--color-paper)]/50"
          />
          {manualQuery.trim().length >= 2 && suggestions.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full border border-[var(--color-line)] bg-[var(--color-paper)] text-[var(--color-ink)]">
              {suggestions.map((s) => (
                <li key={`${s.lat}-${s.lng}`}>
                  <button
                    type="button"
                    onClick={() => {
                      onPick(s);
                      setManualQuery("");
                    }}
                    className="block w-full px-3 py-2 text-left text-sm hover:bg-[var(--color-paper-dim)]"
                  >
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
