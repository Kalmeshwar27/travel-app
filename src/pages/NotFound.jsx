import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { PageShell } from "../components/layout/PageShell";
import { Button } from "../components/common/Common";

export function NotFound() {
  return (
    <PageShell className="flex flex-col items-center justify-center py-32 text-center">
      <Compass className="h-10 w-10 text-[var(--color-ink-soft)]" aria-hidden="true" />
      <h1 className="mt-4 font-display text-4xl">Off the map</h1>
      <p className="mt-2 max-w-sm text-[var(--color-ink-soft)]">
        There's nothing charted at this address. Head back and pick a destination.
      </p>
      <Button as={Link} to="/" variant="route" className="mt-6">
        Back to Waypoint
      </Button>
    </PageShell>
  );
}
