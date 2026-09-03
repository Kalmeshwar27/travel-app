import { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PageShell } from "../components/layout/PageShell";
import { ItineraryForm } from "../components/itinerary/ItineraryForm";
import { ItineraryTimeline } from "../components/itinerary/ItineraryTimeline";
import { ErrorState, Spinner } from "../components/common/Common";
import { destinations } from "../data/destinations";
import { generateItinerary } from "../services/geminiApi";

export function Itinerary() {
  const [params] = useSearchParams();
  const defaultDestinationId = params.get("destination") || destinations[0].id;

  const [itinerary, setItinerary] = useState(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const [submittedFor, setSubmittedFor] = useState(null);
  const lastValuesRef = useRef(null);

  async function handleSubmit(values) {
    const destination = destinations.find((d) => d.id === values.destinationId) || destinations[0];
    lastValuesRef.current = { ...values, destination };
    await run(lastValuesRef.current);
  }

  async function run(payload) {
    setPending(true);
    setError(null);
    setItinerary(null);
    setSubmittedFor(payload.destination.name);
    try {
      const result = await generateItinerary(payload);
      setItinerary(result);
    } catch (err) {
      console.error("[itinerary] generation failed", err);
      setError(err);
    } finally {
      setPending(false);
    }
  }

  return (
    <PageShell>
      <h1 className="font-display text-4xl">Plan a trip</h1>
      <p className="mt-2 max-w-xl text-[var(--color-ink-soft)]">
        Tell the assistant your interests and pace — it drafts a day-by-day plan you can adjust and
        regenerate.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[0.9fr_1.4fr]">
        <ItineraryForm onSubmit={handleSubmit} pending={pending} defaultDestinationId={defaultDestinationId} />

        <div>
          {pending && (
            <div className="flex flex-col items-center justify-center gap-3 border border-[var(--color-line)] py-20 text-center">
              <Spinner className="h-6 w-6 text-[var(--color-route)]" />
              <p className="coord text-[var(--color-ink-soft)]">
                Drafting {submittedFor ? `your ${submittedFor} itinerary` : "your itinerary"}…
              </p>
            </div>
          )}

          {!pending && error && (
            <ErrorState
              title="Couldn't generate an itinerary"
              message={error.message}
              onRetry={lastValuesRef.current ? () => run(lastValuesRef.current) : undefined}
            >
              {error.raw && (
                <details className="mt-3 w-full max-w-md text-left text-xs text-[var(--color-ink-soft)]">
                  <summary className="cursor-pointer select-none">Show technical details</summary>
                  <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-words border border-[var(--color-line)] bg-[var(--color-paper-dim)] p-2">
{error.code ? `code: ${error.code}\n` : ""}{error.status ? `status: ${error.status}\n` : ""}{error.raw}
                  </pre>
                </details>
              )}
            </ErrorState>
          )}

          {!pending && !error && itinerary && <ItineraryTimeline itinerary={itinerary} />}

          {!pending && !error && !itinerary && (
            <div className="flex h-full min-h-[240px] items-center justify-center border border-dashed border-[var(--color-line)] text-center text-[var(--color-ink-soft)]">
              <p className="max-w-xs text-sm">
                Fill in the form and generate a plan — it'll appear here as a day-by-day itinerary.
              </p>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
