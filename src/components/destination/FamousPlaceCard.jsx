import { RemoteImage } from "../common/RemoteImage";
import { Badge } from "../common/Common";

export function FamousPlaceCard({ place }) {
  return (
    <article className="flex gap-4 border-b border-[var(--color-line)] py-5 first:pt-0 last:border-none">
      <RemoteImage
        query={place.imageQuery}
        alt={place.name}
        aspect="aspect-square"
        className="w-24 shrink-0 sm:w-32"
      />
      <div>
        <Badge className="mb-1.5">{place.category}</Badge>
        <h4 className="font-display text-lg leading-tight">{place.name}</h4>
        <p className="mt-1 text-sm text-[var(--color-ink-soft)]">{place.description}</p>
      </div>
    </article>
  );
}
