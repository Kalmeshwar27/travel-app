# Waypoint — Travel Explorer

A front-end travel application built for the Designesthetics Front-End Developer
assignment: explore destinations, check live weather, and get an AI assistant
to answer questions and generate a day-by-day itinerary.

**Live demo:** _add your deployed Vercel/Netlify URL here before submitting_
**Repository:** _add your public GitHub URL here_

## Features

- **Landing hero** — full-bleed looping background video with a search entry
  point into the explorer.
- **Destination explorer** — search and filter by region or interest;
  destination cards link to a dedicated details page.
- **Destination details** — overview, famous places (image + category +
  description, not a bare list), a photo gallery, live weather, and a
  destination-aware AI chat panel.
- **Location awareness** — asks for the visitor's location once; if denied or
  unavailable, a manual city search (geocoding) is always available so the
  app is never blocked on permission.
- **Live weather** — current conditions (temperature, feels-like, humidity,
  wind) via OpenWeather, with skeleton and error states.
- **Dynamic images** — every photo is fetched at render time from
  Unsplash (with a Pexels fallback), never hardcoded into the project.
- **AI travel assistant** — a Gemini-backed chat panel, scoped to the open
  destination, for questions like "how many days should I spend here?".
- **Itinerary planning** — a form (days, pace, budget, interests) that asks
  Gemini for strict JSON, validates it with Zod before rendering, and
  displays it as a real day-by-day timeline, never as a block of chat text.
- **Designed failure states** — every external call (weather, images, AI,
  geolocation, geocoding) has its own loading skeleton, empty state, and
  error/retry state.
- **Accessibility** — semantic landmarks, a skip-to-content link, visible
  keyboard focus throughout, labeled form controls, Escape-to-close on the
  mobile chat drawer, and prefers-reduced-motion support.
- **Responsive** — from a phone up to a large desktop screen.

## APIs used

| Purpose      | Provider                          |
| ------------ | ---------------------------------- |
| Weather      | OpenWeather — Current Weather + Geocoding |
| Images       | Unsplash (Pexels as fallback) |
| AI assistant | Google Gemini (gemini-2.5-flash) |
| Video        | Coverr (hero background) |

All destination/place data (names, descriptions, coordinates) is a small
curated dataset in `src/data/destinations.js` — only imagery and live weather
are fetched from external services, as the assignment asks.

## Tech stack

React 19 + Vite, React Router, TanStack Query (server-state caching &
retries), Zustand (location/UI state), React Hook Form + Zod (validated
forms and AI-output validation), Tailwind CSS v4, Lucide icons.

## Project structure

```
src/
  app/            router, root layout, providers
  pages/          Home, Destinations, DestinationDetails, Itinerary, NotFound
  components/     layout, destination, weather, chatbot, itinerary, common
  services/       weatherApi, geocodingApi, imageApi, geminiApi (thin, normalized)
  hooks/          useGeolocation, useWeather, useLocationSearch, useDestinations, ...
  store/          zustand travelStore (active location)
  schemas/        zod schemas -- itinerary form + AI output validation
  data/           destinations.js -- curated seed dataset
api/
  gemini.js       optional Vercel serverless proxy for the Gemini key
```

## Running locally

```bash
npm install
cp .env.example .env   # then fill in your API keys
npm run dev
```

Open the printed local URL (typically http://localhost:5173).

To build for production:

```bash
npm run build
npm run preview
```

## API keys & security

- Never commit `.env` -- it's already in `.gitignore`.
- `VITE_OPENWEATHER_API_KEY`, `VITE_UNSPLASH_ACCESS_KEY` / `VITE_PEXELS_API_KEY`,
  and `VITE_GEMINI_API_KEY` are read from `import.meta.env`. Anything
  VITE_-prefixed is bundled into the client -- acceptable for free-tier
  weather/image keys, but not ideal for a key that can incur cost.
- For that reason, `api/gemini.js` is included as a Vercel serverless
  function that proxies Gemini requests server-side. `src/services/geminiApi.js`
  calls `/api/gemini` first and only falls back to the direct client-side
  call (using `VITE_GEMINI_API_KEY`) if that route isn't available -- e.g.
  when running plain `npm run dev` without `vercel dev`. If you deploy to
  Vercel, set `GEMINI_API_KEY` (no VITE_ prefix) in the project's
  Environment Variables and the key never reaches the browser.

## Getting API keys

- OpenWeather: create a free account at openweathermap.org, API keys tab.
- Unsplash: register an app at unsplash.com/developers for an Access Key.
- Gemini: create a key at aistudio.google.com/apikey.

## Deploying

1. Push this repo to GitHub (public).
2. Import it into Vercel (or Netlify).
3. Add the environment variables above in the project settings.
4. Deploy, then open the live URL in a private/incognito window to verify
   nothing depends on local-only state.

## Known trade-offs

- The destination catalog is a small curated set rather than a full live
  destinations API. A static, well-modeled dataset kept focus on the
  required UX surfaces (explorer, details, weather, AI, itinerary).
- The hero video streams from a public Coverr URL rather than being bundled,
  to keep the repo light -- swap in your own asset in `src/pages/Home.jsx`
  if you'd rather self-host it.

## Screenshots

_Add 3-4 screenshots here before submitting: home hero, destination explorer,
destination details with weather + chat, and the generated itinerary._
