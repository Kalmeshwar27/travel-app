const MODEL = "gemini-3.6-flash";

const FRIENDLY_BY_CODE = {
  UNAVAILABLE: "The travel assistant is temporarily unavailable due to high demand. Please try again in a moment.",
  RESOURCE_EXHAUSTED: "The travel assistant hit its usage limit. Please try again shortly.",
  DEADLINE_EXCEEDED: "The travel assistant took too long to respond. Please try again.",
  INVALID_API_KEY: "The travel assistant isn't configured correctly on the server.",
  PERMISSION_DENIED: "The travel assistant isn't configured correctly on the server.",
};

function friendlyMessage(status, body) {
  const code = body?.error?.code || body?.error?.status;
  if (code && FRIENDLY_BY_CODE[code]) return FRIENDLY_BY_CODE[code];
  if (status === 503) return FRIENDLY_BY_CODE.UNAVAILABLE;
  if (status === 429) return FRIENDLY_BY_CODE.RESOURCE_EXHAUSTED;
  if (status === 504 || status === 524) return FRIENDLY_BY_CODE.DEADLINE_EXCEEDED;
  if (status === 401 || status === 403) return FRIENDLY_BY_CODE.PERMISSION_DENIED;
  return "The travel assistant is temporarily unavailable. Please try again.";
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: { message: "Method not allowed" } });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: { message: FRIENDLY_BY_CODE.PERMISSION_DENIED, code: "PERMISSION_DENIED" },
    });
  }

  try {
    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      }
    );

    let body = null;
    try {
      body = await upstream.json();
    } catch {
      body = null;
    }

    if (!upstream.ok || body?.error) {
      const providerCode = body?.error?.code || body?.error?.status;
      return res.status(200).json({
        error: {
          message: friendlyMessage(upstream.status, body),
          code: providerCode || "UPSTREAM_ERROR",
          providerStatus: upstream.status,
        },
      });
    }

    return res.status(200).json(body);
  } catch {
    return res.status(200).json({
      error: { message: FRIENDLY_BY_CODE.UNAVAILABLE, code: "UNAVAILABLE" },
    });
  }
}