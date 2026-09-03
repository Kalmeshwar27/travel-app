import { itinerarySchema } from "../schemas/itinerarySchema";

const DIRECT_URL = (model) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL = import.meta.env.VITE_GEMINI_MODEL || "gemini-3.6-flash";


const FRIENDLY_BY_CODE = {
  UNAVAILABLE: "The travel assistant is temporarily unavailable due to high demand. Please try again in a moment.",
  RESOURCE_EXHAUSTED: "The travel assistant hit its usage limit. Please try again shortly.",
  DEADLINE_EXCEEDED: "The travel assistant took too long to respond. Please try again.",
  INVALID_API_KEY: "The travel assistant isn't configured correctly.",
  PERMISSION_DENIED: "The travel assistant isn't configured correctly.",
  MISSING_KEY: "The AI assistant isn't configured. Add a Gemini API key to continue.",
  EMPTY_RESPONSE: "The assistant returned an empty response. Please try again.",
  PARSE_ERROR: "We couldn't read the assistant's response. Please try again.",
  VALIDATION_ERROR: "We couldn't read the assistant's response. Please try again.",
  NETWORK: "Couldn't reach the travel assistant. Check your connection and try again.",
};

function friendlyMessage(code, status) {
  if (code && FRIENDLY_BY_CODE[code]) return FRIENDLY_BY_CODE[code];
  if (status === 503) return FRIENDLY_BY_CODE.UNAVAILABLE;
  if (status === 429) return FRIENDLY_BY_CODE.RESOURCE_EXHAUSTED;
  if (status === 504 || status === 524) return FRIENDLY_BY_CODE.DEADLINE_EXCEEDED;
  if (status === 401 || status === 403) return FRIENDLY_BY_CODE.PERMISSION_DENIED;
  return "The travel assistant is temporarily unavailable. Please try again.";
}

function makeError(code, status, raw, fallbackMessage) {
  const err = new Error(friendlyMessage(code, status) || fallbackMessage);
  err.code = code || "UPSTREAM_ERROR";
  if (status) err.status = status;
  if (raw) err.raw = typeof raw === "string" ? raw : JSON.stringify(raw).slice(0, 1000);
  return err;
}

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
      const code = data?.error?.code;
      const status = data?.error?.providerStatus;
      lastErr = makeError(code, status || res.status, data?.error, "Server proxy error.");
    } else if (res.status !== 404) {
      lastErr = makeError(res.status === 503 ? "UNAVAILABLE" : "UPSTREAM_ERROR", res.status, null, "Server proxy error.");
    }
  } catch (err) {
    if (err.name === "AbortError") throw err;
    lastErr = makeError("NETWORK", null, null, "Couldn't reach the server.");
  }

  if (!GEMINI_KEY) {
    if (lastErr) throw lastErr;
    throw makeError("MISSING_KEY", null, null, FRIENDLY_BY_CODE.MISSING_KEY);
  }

  try {
    const res = await fetch(`${DIRECT_URL(MODEL)}?key=${GEMINI_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal,
    });
    let data = null;
    try {
      data = await res.json();
    } catch {
      /* non-JSON error body */
    }
    if (!res.ok || data?.error) {
      const providerCode = data?.error?.code || data?.error?.status;
      throw makeError(providerCode, res.status, data, "The travel assistant is temporarily unavailable.");
    }
    return data;
  } catch (err) {
    if (err.name === "AbortError") throw err;
    if (err.code) throw err;
    throw makeError("NETWORK", null, null, "Couldn't reach the AI provider.");
  }
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
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
      },
    },
    opts
  );

  const text = extractText(result);
  if (!text) {
    throw makeError("EMPTY_RESPONSE", null, result, FRIENDLY_BY_CODE.EMPTY_RESPONSE);
  }
  let parsed;
  try {
    parsed = JSON.parse(stripFences(text));
  } catch {
    const repaired = tryRepairJson(stripFences(text));
    if (repaired) {
      parsed = repaired;
    } else {
      throw makeError("PARSE_ERROR", null, text, FRIENDLY_BY_CODE.PARSE_ERROR);
    }
  }

  const validated = itinerarySchema.safeParse(parsed);
  if (!validated.success) {
    throw makeError("VALIDATION_ERROR", null, parsed, FRIENDLY_BY_CODE.VALIDATION_ERROR);
  }
  return validated.data;
}

function stripFences(text) {
  return text.trim().replace(/^```(json)?/i, "").replace(/```$/, "").trim();
}

function tryRepairJson(text) {
  try {
    const firstBrace = text.indexOf("{");
    if (firstBrace === -1) return null;
    let depth = 0;
    let inString = false;
    let escape = false;
    let end = -1;
    for (let i = firstBrace; i < text.length; i++) {
      const ch = text[i];
      if (escape) { escape = false; continue; }
      if (ch === "\\") { escape = true; continue; }
      if (ch === '"') { inString = !inString; continue; }
      if (inString) continue;
      if (ch === "{") depth++;
      else if (ch === "}") {
        depth--;
        if (depth === 0) { end = i; break; }
      }
    }
    if (end === -1) return null;
    let candidate = text.slice(firstBrace, end + 1);
    candidate = candidate.replace(/,\s*([}\]])/g, "$1");
    return JSON.parse(candidate);
  } catch {
    return null;
  }
}
