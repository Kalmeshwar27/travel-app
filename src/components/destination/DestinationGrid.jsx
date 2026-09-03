import { DestinationCard } from "./DestinationCard";
import { EmptyState } from "../common/Common";
import { Compass } from "lucide-react";

export function DestinationGrid({ destinations, onReset }) {
  if (destinations.length === 0) {
    return (
      <EmptyState
        icon={Compass}
        title="No destinations match those filters"
        message="Try a different region, interest, or search term."
        action={
          onReset && (
            <button type="button" onClick={onReset} className="coord text-[var(--color-route)] underline underline-offset-4">
              Reset filters
            </button>
          )
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {destinations.map((d) => (
        <DestinationCard key={d.id} destination={d} />
      ))}
    </div>
  );
}
