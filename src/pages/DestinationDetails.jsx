import { useParams, Link, Navigate } from "react-router-dom";
import { findDestinationBySlug } from "../data/destinations";
import { PageShell } from "../components/layout/PageShell";
import { RemoteImage } from "../components/common/RemoteImage";
import { FamousPlaceCard } from "../components/destination/FamousPlaceCard";
import { WeatherWidget } from "../components/weather/WeatherWidget";
import { ChatPanel } from "../components/chatbot/ChatPanel";
import { Button, Badge } from "../components/common/Common";
import { ArrowLeft, CalendarDays } from "lucide-react";

export function DestinationDetails() {
  const { slug } = useParams();
  const destination = findDestinationBySlug(slug);

  if (!destination) return <Navigate to="/destinations" replace />;

  return (
    <>
      <RemoteImage
        query={destination.imageQuery}
        alt={`${destination.name}, ${destination.country}`}
        aspect="aspect-[21/9]"
        className="w-full"
      />

      <PageShell>
        <Link to="/destinations" className="coord mb-6 flex w-fit items-center gap-1.5 text-[var(--color-ink-soft)] hover:text-[var(--color-route)]">
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Back to explorer
        </Link>

        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <div className="coord flex items-center gap-3 text-[var(--color-ink-soft)]">
              <span>
                {destination.coordinates.lat.toFixed(2)}, {destination.coordinates.lng.toFixed(2)}
              </span>
              <span>·</span>
              <span>{destination.region}</span>
            </div>
            <h1 className="mt-2 font-display text-5xl">{destination.name}</h1>
            <p className="mt-1 text-lg text-[var(--color-ink-soft)]">{destination.country}</p>
            <p className="mt-5 max-w-2xl leading-relaxed">{destination.description}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              {destination.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>

            <Button
              as={Link}
              to={`/itinerary?destination=${destination.id}`}
              variant="route"
              className="mt-6"
            >
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              Plan a trip here
            </Button>

            <div className="mt-14">
              <h2 className="rule mb-6 pt-6 font-display text-2xl">Famous places</h2>
              <div>
                {destination.famousPlaces.map((place) => (
                  <FamousPlaceCard key={place.id} place={place} />
                ))}
              </div>
            </div>

            <div className="mt-14">
              <h2 className="rule mb-6 pt-6 font-display text-2xl">Gallery</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {destination.famousPlaces.map((place) => (
                  <RemoteImage key={place.id} query={place.imageQuery} alt={place.name} aspect="aspect-square" />
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div>
              <h2 className="coord mb-2 text-[var(--color-ink-soft)]">Current weather</h2>
              <WeatherWidget lat={destination.coordinates.lat} lng={destination.coordinates.lng} label={destination.name} />
              <p className="coord mt-2 text-[var(--color-ink-soft)]">Best time to visit: {destination.bestTime}</p>
            </div>

            <div>
              <h2 className="coord mb-2 text-[var(--color-ink-soft)]">Ask about {destination.name}</h2>
              <ChatPanel destination={destination} />
            </div>
          </aside>
        </div>
      </PageShell>
    </>
  );
}
