import { request } from "./http";

const BASE_URL = "https://api.openweathermap.org/geo/1.0/direct";
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export async function searchLocations(query, { signal, limit = 5 } = {}) {
  if (!API_KEY) {
    const err = new Error("Location search is not configured.");
    err.code = "MISSING_KEY";
    throw err;
  }
  if (!query || query.trim().length < 2) return [];

  const url = `${BASE_URL}?q=${encodeURIComponent(query)}&limit=${limit}&appid=${API_KEY}`;
  const data = await request(url, { signal });

  return (data || []).map((place) => ({
    label: [place.name, place.state, place.country].filter(Boolean).join(", "),
    lat: place.lat,
    lng: place.lon,
    country: place.country,
  }));
}

const REVERSE_URL = "https://api.openweathermap.org/geo/1.0/reverse";


export async function reverseGeocode(lat, lng, { signal } = {}) {
  if (!API_KEY) return null;
  try {
    const url = `${REVERSE_URL}?lat=${lat}&lon=${lng}&limit=1&appid=${API_KEY}`;
    const data = await request(url, { signal });
    const place = data?.[0];
    if (!place) return null;
    return [place.name, place.country].filter(Boolean).join(", ");
  } catch {
    return null;
  }
}