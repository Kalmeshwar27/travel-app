/**
 * Thin fetch wrapper: enforces a timeout, forwards AbortSignal, and
 * normalizes non-OK responses into thrown Errors with a readable message.
 */
export async function request(url, { signal, timeoutMs = 10000, ...init } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener("abort", () => controller.abort(), { once: true });
  }

  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    if (!res.ok) {
      let detail = "";
      try {
        detail = await res.text();
      } catch {
        /* ignore */
      }
      const err = new Error(`Request failed (${res.status}): ${detail || res.statusText}`);
      err.status = res.status;
      throw err;
    }
    return await res.json();
  } catch (err) {
    if (err.name === "AbortError") {
      const timedOut = new Error("Request timed out. Check your connection and try again.");
      timedOut.name = "TimeoutError";
      throw timedOut;
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}
