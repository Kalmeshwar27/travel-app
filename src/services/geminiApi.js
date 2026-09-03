import { itinerarySchema } from "../schemas/itinerarySchema";

const DIRECT_URL = (model) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL = import.meta.env.VITE_GEMINI_MODEL || "gemini-3.6-flash";

/**
 * Every call is tried against the Vercel serverless proxy first
 * (/api/gemini — see /api/gemini.js) so the API key never has to ship to
 * the browser in production. If that route isn't available — e.g. running
 * `npm run dev` without `vercel dev` — it falls back to calling Gemini
 * directly with VITE_GEMINI_API_KEY, which is fine for local development.
 */
async function callGemini(payload, { signal } = {}) {
  let lastErr;
  try {
    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal,
    });
    if (res.ok) {
      const data = await res.json();
      if (data && !data.error) return data;
      lastErr = new Error(data?.error?.message || `Server proxy error (${res.status}).`);
      lastErr.status = res.status;
    } else if (res.status !== 404) {
      lastErr = await responseError(res);
    }
  } catch (err) {
    if (err.name === "AbortError") throw err;
    lastErr = err;
  }

  if (!GEMINI_KEY) {
    if (lastErr) throw lastErr;
    const err = new Error("The AI assistant isn't configured. Add a Gemini API key to continue.");
    err.code = "MISSING_KEY";
    throw err;
  }

  try {
    const res = await fetch(`${DIRECT_URL(MODEL)}?key=${GEMINI_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal,
    });
    const data = await res.json();
    if (!res.ok) {
      const err = new Error(data?.error?.message || `The AI assistant is unavailable right now (${res.status}).`);
      err.status = res.status;
      err.raw = JSON.stringify(data);
      throw err;
    }
    if (data?.error) {
      const err = new Error(data.error.message || "The AI assistant returned an error.");
      err.raw = JSON.stringify(data);
      throw err;
    }
    return data;
  } catch (err) {
    if (err.name === "AbortError") throw err;
    if (!lastErr) throw err;
    throw err;
  }
}

async function responseError(res) {
  let detail = "";
  try {
    detail = await res.text();
  } catch {
    /* ignore */
  }
  const err = new Error(`AI proxy returned ${res.status}: ${detail || res.statusText}`);
  err.status = res.status;
  return err;
}

function extractText(result) {
  const parts = result?.candidates?.[0]?.content?.parts;
  if (!parts) return "";
  return parts.map((p) => p.text || "").join("");
}

/**
 * sendTravelQuestion({ destination, history }, question) -> string answer.
 * `history` is a short array of { role: 'user'|'model', text } turns.
 */
export async function sendTravelQuestion({ destination, history = [] }, question, opts = {}) {
  const systemContext = destination
    ? `You are a knowledgeable, concise travel assistant helping a visitor decide about ${destination.name}, ${destination.country}. ` +
      `Known facts — best time to visit: ${destination.bestTime}; notable places: ${destination.famousPlaces
        .map((p) => p.name)
        .join(", ")}. ` +
      `Answer only what's asked, in 2-4 short sentences unless the visitor asks for more detail. Be specific and practical.`
    : `You are a knowledgeable, concise travel assistant. Answer in 2-4 short sentences unless asked for more detail.`;

  const contents = [
    ...history.map((turn) => ({ role: turn.role, parts: [{ text: turn.text }] })),
    { role: "user", parts: [{ text: question }] },
  ];

  const result = await callGemini(
    {
      systemInstruction: { parts: [{ text: systemContext }] },
      contents,
      generationConfig: { temperature: 0.6, maxOutputTokens: 400 },
    },
    opts
  );

  const text = extractText(result);
  if (!text) throw new Error("The assistant didn't return an answer. Try rephrasing your question.");
  return text.trim();
}

/**
 * generateItinerary(input) -> validated Itinerary object (see itinerarySchema).
 * Requests strict JSON from the model and validates it — never renders
 * unvalidated AI output.
 */
export async function generateItinerary(input, opts = {}) {
  const { destination, days, interests = [], pace = "balanced", budget = "moderate" } = input;

  const prompt = `Plan a ${days}-day trip to ${destination.name}, ${destination.country}.
Traveler interests: ${interests.length ? interests.join(", ") : "general sightseeing"}.
Pace: ${pace}. Budget: ${budget}.
Known notable places to draw from (use real ones, you may add other well-known nearby spots too): ${destination.famousPlaces
    .map((p) => p.name)
    .join(", ")}.

Respond with ONLY a JSON object matching exactly this shape, no prose, no markdown fences:
{
  "destination": string,
  "days": [
    {
      "day": number,
      "title": string,
      "morning": [{"time": string, "activity": string}],
      "afternoon": [{"time": string, "activity": string}],
      "evening": [{"time": string, "activity": string}],
      "notes": [string]
    }
  ]
}`;

  const result = await callGemini(
    {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 2048,
        responseMimeType: "application/json",
      },
    },
    opts
  );

  const text = extractText(result);
  if (!text) {
    const err = new Error("The assistant returned an empty response. Check the API key / model name.");
    err.code = "EMPTY_RESPONSE";
    err.raw = JSON.stringify(result).slice(0, 1000);
    throw err;
  }
  let parsed;
  try {
    parsed = JSON.parse(stripFences(text));
  } catch {
    const err = new Error("The itinerary came back in an unexpected format. Please try again.");
    err.code = "PARSE_ERROR";
    err.raw = text.slice(0, 500);
    throw err;
  }

  const validated = itinerarySchema.safeParse(parsed);
  if (!validated.success) {
    const issues = validated.error.issues.map((i) => `${i.path.join(".") || "<root>"}: ${i.message}`).join("; ");
    const err = new Error(`The itinerary didn't match the expected structure (${issues}). Please try again.`);
    err.code = "VALIDATION_ERROR";
    err.raw = JSON.stringify(parsed).slice(0, 500);
    throw err;
  }
  return validated.data;
}

function stripFences(text) {
  return text.trim().replace(/^```(json)?/i, "").replace(/```$/, "").trim();
}
