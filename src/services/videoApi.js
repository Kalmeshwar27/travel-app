import { request } from "./http";

const PEXELS_KEY = import.meta.env.VITE_PEXELS_API_KEY;

export async function searchVideo(query, { signal } = {}) {
  if (!PEXELS_KEY) return null;

  const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(
    query
  )}&per_page=1&orientation=landscape&size=large`;

  try {
    const data = await request(url, {
      signal,
      headers: { Authorization: PEXELS_KEY },
    });
    const video = data.videos?.[0];
    if (!video) return null;

    const files = (video.video_files || [])
      .filter((f) => f.file_type === "video/mp4" && f.width)
      .sort((a, b) => b.width - a.width);

    const best = files.find((f) => f.width <= 1920) || files[files.length - 1];
    if (!best) return null;

    return {
      url: best.link,
      poster: video.image,
      credit: video.user?.name ? `${video.user.name} / Pexels` : "Pexels",
    };
  } catch (err) {
    console.warn("Pexels video lookup failed:", err.message);
    return null;
  }
}