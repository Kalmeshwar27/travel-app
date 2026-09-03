import { Sun, Sunrise, Sunset, StickyNote } from "lucide-react";

export function ItineraryTimeline({ itinerary }) {
  return (
    <div className="route-line space-y-10 pl-8">
      {itinerary.days.map((day) => (
        <DayCard key={day.day} day={day} />
      ))}
    </div>
  );
}

function DayCard({ day }) {
  return (
    <article className="relative">
      <span
        className="absolute -left-8 top-1 flex h-3 w-3 -translate-x-1/2 items-center justify-center rounded-full bg-[var(--color-route)]"
        aria-hidden="true"
      />
      <p className="coord text-[var(--color-route)]">Day {day.day}</p>
      <h3 className="font-display text-2xl">{day.title}</h3>

      <div className="mt-4 grid gap-6 sm:grid-cols-3">
        <Segment icon={Sunrise} label="Morning" items={day.morning} />
        <Segment icon={Sun} label="Afternoon" items={day.afternoon} />
        <Segment icon={Sunset} label="Evening" items={day.evening} />
      </div>

      {day.notes?.length > 0 && (
        <div className="mt-4 flex gap-2 border-t border-[var(--color-line)] pt-3 text-sm text-[var(--color-ink-soft)]">
          <StickyNote className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <ul className="space-y-1">
            {day.notes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

function Segment({ icon: Icon, label, items }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <p className="coord mb-2 flex items-center gap-1.5 text-[var(--color-ink-soft)]">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {label}
      </p>
      <ul className="space-y-1.5 text-sm">
        {items.map((item, i) => (
          <li key={i}>
            <span className="coord text-[var(--color-harbor)]">{item.time}</span>{" "}
            <span>{item.activity}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
