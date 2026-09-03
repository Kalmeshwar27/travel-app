import { request } from "./http";

const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const PEXELS_KEY = import.meta.env.VITE_PEXELS_API_KEY;


export async function searchImages(query, count = 1, { signal } = {}) {
  if (PEXELS_KEY) {
    try {
      return await searchPexels(query, count, signal);
    } catch (err) {
      console.warn("Pexels lookup failed, falling back:", err.message);
    }
  }
  if (UNSPLASH_KEY) {
    try {
      return await searchUnsplash(query, count, signal);
    } catch (err) {
      console.warn("Unsplash lookup failed, falling back:", err.message);
    }
  }
  return [];
}

async function searchUnsplash(query, count, signal) {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
    query
  )}&per_page=${count}&orientation=landscape`;
  const data = await request(url, {
    signal,
    headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` },
  });
  return (data.results || []).map((photo) => ({
    id: photo.id,
    url: photo.urls?.regular,
    thumbUrl: photo.urls?.small,
    alt: photo.alt_description || query,
    credit: photo.user?.name ? `${photo.user.name} / Unsplash` : "Unsplash",
    creditUrl: photo.links?.html,
  }));
}

async function searchPexels(query, count, signal) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(
    query
  )}&per_page=${count}&orientation=landscape`;
  const data = await request(url, {
    signal,
    headers: { Authorization: PEXELS_KEY },
  });
  return (data.photos || []).map((photo) => ({
    id: String(photo.id),
    url: photo.src?.large2x || photo.src?.original || photo.src?.large,
    thumbUrl: photo.src?.medium,
    alt: photo.alt || query,
    credit: photo.photographer ? `${photo.photographer} / Pexels` : "Pexels",
    creditUrl: photo.url,
  }));
}
