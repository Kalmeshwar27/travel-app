import { useDestinationImages } from "../../hooks/useDestinationImages";
import { SkeletonBlock } from "../common/Common";
import { ImageOff } from "lucide-react";
import clsx from "clsx";

export function RemoteImage({ query, alt, className, aspect = "aspect-[4/3]" }) {
  const { data, isLoading, isError } = useDestinationImages(query, 1);
  const photo = data?.[0];

  if (isLoading) {
    return <SkeletonBlock className={clsx(aspect, className)} />;
  }

  if (isError || !photo) {
    return (
      <div
        className={clsx(
          aspect,
          className,
          "flex flex-col items-center justify-center gap-2 bg-[var(--color-paper-dim)] text-[var(--color-ink-soft)]"
        )}
      >
        <ImageOff className="h-6 w-6" aria-hidden="true" />
        <span className="coord">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className={clsx(aspect, className, "relative overflow-hidden")}>
      <img
        src={photo.url}
        alt={alt || photo.alt}
        loading="lazy"
        className="h-full w-full object-cover"
      />
      {photo.credit && (
        <span className="coord absolute bottom-1.5 right-1.5 bg-[var(--color-ink)]/70 px-1.5 py-0.5 text-[var(--color-paper)]">
          {photo.credit}
        </span>
      )}
    </div>
  );
}
