import { request } from "./http";

const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

/**
 * getCurrentWeather(lat, lng) -> normalized Weather object.
 * Throws if no API key is configured, or if the request fails —
 * callers (useWeather) turn that into the widget's error state.
 */
export async function getCurrentWeather(lat, lng, { signal } = {}) {
  if (!API_KEY) {
    const err = new Error("OpenWeather API key is not configured.");
    err.code = "MISSING_KEY";
    throw err;
  }
  const url = `${BASE_URL}?lat=${lat}&lon=${lng}&units=metric&appid=${API_KEY}`;
  const data = await request(url, { signal });
  return normalizeWeather(data);
}

function normalizeWeather(data) {
  const w = data.weather?.[0] ?? {};
  return {
    temperature: Math.round(data.main?.temp),
    feelsLike: Math.round(data.main?.feels_like),
    condition: w.description ? capitalize(w.description) : "Unknown",
    icon: w.icon ?? null,
    humidity: data.main?.humidity ?? null,
    windSpeed: data.wind?.speed ?? null,
    cityName: data.name || null,
    observedAt: data.dt ? new Date(data.dt * 1000) : new Date(),
  };
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function weatherIconUrl(icon) {
  return icon ? `https://openweathermap.org/img/wn/${icon}@2x.png` : null;
}
