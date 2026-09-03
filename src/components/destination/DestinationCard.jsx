import { Link } from "react-router-dom";
import { RemoteImage } from "../common/RemoteImage";
import { ArrowUpRight } from "lucide-react";

export function DestinationCard({ destination, featured = false }) {
  return (
    <Link
      to={`/destinations/${destination.slug}`}
      className="group block border border-[var(--color-line)] bg-[var(--color-paper)] transition-shadow hover:shadow-[var(--shadow-card)]"
    >
      <RemoteImage
        query={destination.imageQuery}
        alt={`${destination.name}, ${destination.country}`}
        aspect={featured ? "aspect-[16/10]" : "aspect-[4/3]"}
        className="grayscale-[15%] transition-[filter] duration-300 group-hover:grayscale-0"
      />
      <div className="p-4">
        <div className="coord flex items-center justify-between text-[var(--color-ink-soft)]">
          <span>
            {destination.coordinates.lat.toFixed(2)}, {destination.coordinates.lng.toFixed(2)}
          </span>
          <span>{destination.region}</span>
        </div>
        <h3 className="mt-1 flex items-center gap-1 font-display text-2xl">
          {destination.name}
          <ArrowUpRight
            className="h-4 w-4 -translate-y-0.5 opacity-0 transition-opacity group-hover:opacity-100"
            aria-hidden="true"
          />
        </h3>
        <p className="text-sm text-[var(--color-ink-soft)]">{destination.country}</p>
      </div>
    </Link>
  );
}
