import { useParams, Link, Navigate } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import { searchImages } from "../services/imageApi";
import { findDestinationBySlug } from "../data/destinations";
import { PageShell } from "../components/layout/PageShell";
import { RemoteImage } from "../components/common/RemoteImage";
import { FamousPlaceCard } from "../components/destination/FamousPlaceCard";
import { WeatherWidget } from "../components/weather/WeatherWidget";
import { ChatPanel } from "../components/chatbot/ChatPanel";
import { Button, Badge, SkeletonBlock } from "../components/common/Common";
import { Lightbox, useLightbox } from "../components/common/Lightbox";
import { ArrowLeft, CalendarDays } from "lucide-react";

function GalleryItem({ place, onOpen, index, image }) {
  if (!image) return <SkeletonBlock className="aspect-square" />;
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      aria-label={`Open image of ${place.name}`}
      className="group relative aspect-square overflow-hidden focus:outline-none focus:ring-2 focus:ring-[var(--color-route)]"
    >
      <img
        src={image.url}
        alt={place.name}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1.5 text-left text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
        {place.name}
      </span>
    </button>
  );
}

export function DestinationDetails() {
  const { slug } = useParams();
  const destination = findDestinationBySlug(slug);
  const lightbox = useLightbox();
  const galleryQueries = useQueries({
    queries: (destination?.famousPlaces || []).map((p) => ({
      queryKey: ["images", p.imageQuery, 1],
      queryFn: ({ signal }) => searchImages(p.imageQuery, 1, { signal }),
      enabled: Boolean(p.imageQuery),
      staleTime: 60 * 60 * 1000,
      retry: 1,
    })),
  });
  const galleryImages = galleryQueries.map((q) => q.data?.[0]).filter(Boolean);

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
                {destination.famousPlaces.map((place, i) => (
                  <GalleryItem
                    key={place.id}
                    place={place}
                    index={i}
                    image={galleryImages?.[i]}
                    onOpen={lightbox.open}
                  />
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

      <Lightbox
        images={galleryImages.map((img, i) => ({
          ...img,
          name: destination.famousPlaces[i]?.name,
        }))}
        index={lightbox.index}
        onClose={lightbox.close}
        onPrev={() =>
          lightbox.index !== null &&
          lightbox.open(
            (lightbox.index - 1 + galleryImages.length) % galleryImages.length
          )
        }
        onNext={() =>
          lightbox.index !== null &&
          lightbox.open((lightbox.index + 1) % galleryImages.length)
        }
      />
    </>
  );
}
