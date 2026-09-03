import { Link } from "react-router-dom";
import { RemoteImage } from "../common/RemoteImage";
import { ArrowUpRight } from "lucide-react";

export function DestinationCard({ destination, featured = false }) {
  return (
    <Link
      to={`/destinations/${destination.slug}`}
      className="group relative block overflow-hidden border border-[var(--color-line)] bg-[var(--color-paper)] transition-[transform,box-shadow] duration-500 ease-out will-change-transform hover:-translate-y-1 hover:shadow-[0_12px_28px_-12px_rgba(23,27,26,0.35)]"
    >
      <div className="relative overflow-hidden">
        <RemoteImage
          query={destination.imageQuery}
          alt={`${destination.name}, ${destination.country}`}
          aspect={featured ? "aspect-[16/10]" : "aspect-[4/3]"}
          className="grayscale-[15%] transition-[filter,transform] duration-[700ms] ease-out group-hover:grayscale-0 group-hover:scale-[1.06]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/55 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
        <span
          aria-hidden="true"
          className="route-accent pointer-events-none absolute left-0 right-0 bottom-0 h-[2px] origin-left scale-x-0 bg-[var(--color-route)] transition-transform duration-500 ease-out group-hover:scale-x-100"
        />
      </div>
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
            className="h-4 w-4 -translate-x-1 -translate-y-0.5 opacity-0 transition-[opacity,transform] duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100"
            aria-hidden="true"
          />
        </h3>
        <p className="text-sm text-[var(--color-ink-soft)]">{destination.country}</p>
      </div>
    </Link>
  );
}
