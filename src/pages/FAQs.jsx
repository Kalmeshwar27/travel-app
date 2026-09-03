import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ContentPage } from "../components/layout/ContentPage";

const faqs = [
  {
    id: "what-is-waypoint",
    q: "What is Waypoint?",
    a: (
      <p>
        Waypoint is a field guide for the world. It helps you discover destinations, check live weather as it
        stands right now, and turn your trip ideas into a day-by-day plan — all drawn from a small curated
        dataset rather than a travel-agency brochure.
      </p>
    ),
  },
  {
    id: "is-it-free",
    q: "Is Waypoint free to use?",
    a: (
      <p>
        Yes. The weather, images, and AI assistant use free-tier provider keys. For local development you
        supply your own <span className="coord">VITE_</span>-prefixed keys; deployed to Vercel, the Gemini
        key is proxied server-side so it never reaches your browser.
      </p>
    ),
  },
  {
    id: "how-many-destinations",
    q: "How many destinations are covered?",
    a: (
      <p>
        Waypoint currently covers 11 hand-picked destinations across six regions — from Kyoto's temples to
        the Konkan Coast's beaches. Each entry includes a description, famous places with coordinates, and a
        best-time-to-visit note.
      </p>
    ),
  },
  {
    id: "suggest-destination",
    q: "Can I suggest a new destination?",
    a: (
      <p>
        Not yet directly in the app — the destination set is intentionally small and curated. If you'd like to
        see a place added, reach out through the Contact page and we'll consider it for the next field guide
        update.
      </p>
    ),
  },
  {
    id: "weather-frequency",
    q: "How often is the weather updated?",
    a: (
      <p>
        Weather data is pulled from OpenWeather on demand when you view a destination. It reflects real-time
        conditions at the moment you look — not a forecast for your future travel dates.
      </p>
    ),
  },
  {
    id: "real-time-weather",
    q: "Is the weather data real-time?",
    a: (
      <p>
        Yes — the current conditions (temperature, feels-like, humidity, wind) are fetched fresh from
        OpenWeather each time you open a destination page. Cached responses last for the session via
        TanStack Query to avoid hammering the API.
      </p>
    ),
  },
  {
    id: "ai-provider",
    q: "What powers the AI travel assistant?",
    a: (
      <p>
        The assistant runs on Google's Gemini 2.5 Flash. By default, requests are proxied through a Vercel
        serverless function so the key never touches the browser. When that route isn't available — e.g.
        running plain <span className="coord">npm run dev</span> without Vercel — the client falls back to a
        direct call using a browser-supplied key.
      </p>
    ),
  },
  {
    id: "ai-data-sharing",
    q: "Is my conversation data shared with the AI provider?",
    a: (
      <p>
        Only the prompt you send — your question scoped to the destination — is forwarded to Gemini. No
        location history, account tokens, or personal data beyond the single query is ever included.
        Conversations are not stored or logged after the response is returned.
      </p>
    ),
  },
  {
    id: "ai-accuracy",
    q: "How accurate are the AI responses?",
    a: (
      <p>
        The assistant is knowledgeable but not infallible. It validates structured output — like itinerary
        plans — with Zod before rendering, and every answer should be cross-checked against up-to-date local
        sources. Think of it as a well-read travel companion, not an oracle.
      </p>
    ),
  },
  {
    id: "edit-itinerary",
    q: "Can I edit the generated itinerary?",
    a: (
      <p>
        Absolutely. The itinerary form lets you tweak days, pace, budget, and interests, then regenerate. Each
        new request replaces the previous plan, and you can start over at any time. The timeline renders as a
        scrollable day-by-day view, never a block of chat text.
      </p>
    ),
  },
  {
    id: "how-many-days",
    q: "How many days should I spend on a destination?",
    a: (
      <p>
        There's no universal answer — it depends on pace and interests. The assistant defaults to three days
        and can draft anywhere from 1 to 14. Tell it your preferred pace (relaxed, balanced, packed) and
        budget, and it will suggest a realistic split of morning, afternoon, and evening activities.
      </p>
    ),
  },
  {
    id: "export-itinerary",
    q: "Can I export or share my itinerary?",
    a: (
      <p>
        Not yet — but it's on the roadmap. For now, you can screenshot the timeline or copy the day-by-day
        breakdown manually. We're working on a share link and PDF export for a future release.
      </p>
    ),
  },
];

export function FAQs() {
  const [openId, setOpenId] = useState(null);

  function toggle(id) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <ContentPage
      title="Frequently asked questions"
      subtitle="Everything you need to know about Waypoint. If you can't find what you're looking for, drop us a line."
    >
      <dl className="space-y-2">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div key={faq.id} className="border border-[var(--color-line)]">
              <dt>
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                  className="coord flex w-full items-center justify-between gap-4 bg-[var(--color-paper-dim)]/40 px-6 py-4 text-left text-sm text-[var(--color-ink)] hover:bg-[var(--color-paper-dim)]/70"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className="h-4 w-4 shrink-0 text-[var(--color-ink-soft)] transition-transform"
                    aria-hidden="true"
                    style={{ transform: isOpen ? "rotate(-180deg)" : "rotate(0)" }}
                  />
                </button>
              </dt>
              <dd
                id={`faq-answer-${faq.id}`}
                role="region"
                aria-hidden={!isOpen}
                className="px-6 text-sm text-[var(--color-ink-soft)]"
                style={{ maxHeight: isOpen ? "600px" : "0", overflow: "hidden", transition: "max-height 300ms" }}
              >
                <div className={isOpen ? "py-4" : "py-0"}>{isOpen && faq.a}</div>
              </dd>
            </div>
          );
        })}
      </dl>
    </ContentPage>
  );
}
