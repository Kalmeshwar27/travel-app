import { Link } from "react-router-dom";
import { ContentPage } from "../components/layout/ContentPage";

const articles = [
  {
    id: "getting-started",
    title: "Getting started with Waypoint",
    excerpt:
      "Learn how to search destinations, check live weather, and generate a day-by-day itinerary in under a minute.",
    href: "#getting-started",
  },
  {
    id: "finding-destinations",
    title: "Searching and filtering destinations",
    excerpt:
      "Browse by region, interest tag, or type ahead with a keyword to find exactly where you want to go.",
    href: "#finding-destinations",
  },
  {
    id: "weather-data",
    title: "Weather information",
    excerpt:
      "Real-time conditions sourced from OpenWeather, showing temperature, feels-like, humidity, and wind.",
    href: "#weather-data",
  },
  {
    id: "ai-assistant",
    title: "Using the AI travel assistant",
    excerpt:
      "Ask questions scoped to the destination you're viewing and get structured, actionable answers.",
    href: "#ai-assistant",
  },
  {
    id: "itinerary-editing",
    title: "Editing your itinerary",
    excerpt:
      "Regenerate plans, adjust interests and budget, or start over — the assistant is always ready to refine.",
    href: "#itinerary-editing",
  },
  {
    id: "technical-issues",
    title: "Troubleshooting technical issues",
    excerpt:
      "Steps for clearing cache, checking API keys, and getting in touch when something isn't working right.",
    href: "#technical-issues",
  },
];

const categories = [
  {
    name: "Getting Started",
    items: [
      { label: "Getting started with Waypoint", href: "#getting-started" },
      { label: "Understanding the field-atlas view", href: "#field-atlas-view" },
      { label: "Enabling location permissions", href: "#location-permissions" },
    ],
  },
  {
    name: "Using Waypoint",
    items: [
      { label: "Searching and filtering destinations", href: "#finding-destinations" },
      { label: "Reading destination detail pages", href: "#destination-details" },
      { label: "Checking live weather", href: "#weather-data" },
    ],
  },
  {
    name: "Itinerary planning",
    items: [
      { label: "Generating a day-by-day plan", href: "#generating-itinerary" },
      { label: "Editing your itinerary", href: "#itinerary-editing" },
      { label: "Exporting or sharing a plan", href: "#sharing-itinerary" },
    ],
  },
  {
    name: "AI assistant",
    items: [
      { label: "Using the AI travel assistant", href: "#ai-assistant" },
      { label: "What data is sent to the AI provider", href: "#ai-data" },
      { label: "AI response accuracy", href: "#ai-accuracy" },
    ],
  },
  {
    name: "Technical",
    items: [
      { label: "Troubleshooting technical issues", href: "#technical-issues" },
      { label: "Browser and device support", href: "#browser-support" },
      { label: "Managing API keys locally", href: "#api-keys" },
    ],
  },
];

export function HelpCenter() {
  return (
    <ContentPage
      title="Help Center"
      subtitle="Find answers to common questions about Waypoint, from discovery to itinerary planning."
    >
      <nav aria-label="Topics">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div key={cat.name}>
              <p className="coord text-[var(--color-route)]">{cat.name}</p>
              <ul className="mt-2 space-y-1.5">
                {cat.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className="text-sm text-[var(--color-ink)] underline decoration-transparent underline-offset-2 transition-colors hover:decoration-current"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      <div className="mt-12 rule pt-12">
        <h2 className="font-display text-2xl">Popular articles</h2>
        <dl className="mt-6 space-y-6">
          {articles.map((a) => (
            <div key={a.id}>
              <dt>
                <Link
                  to={a.href}
                  className="font-display text-lg text-[var(--color-ink)] hover:text-[var(--color-route)]"
                >
                  {a.title}
                </Link>
              </dt>
              <dd className="mt-1 text-sm text-[var(--color-ink-soft)]">{a.excerpt}</dd>
            </div>
          ))}
        </dl>
      </div>
    </ContentPage>
  );
}
