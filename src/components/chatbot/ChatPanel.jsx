import { useRef, useState, useEffect } from "react";
import { MessageCircle, Send, X, AlertTriangle } from "lucide-react";
import { sendTravelQuestion } from "../../services/geminiApi";
import { Spinner } from "../common/Common";
import clsx from "clsx";

export function ChatPanel({ destination }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: destination
        ? `Ask me anything about ${destination.name} — how long to stay, what to see, or when to go.`
        : "Ask me anything about your trip.",
    },
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  async function handleSend(e) {
    e.preventDefault();
    const question = input.trim();
    if (!question || pending) return;

    const history = messages.map((m) => ({ role: m.role, text: m.text }));
    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInput("");
    setPending(true);
    setError(null);

    try {
      const answer = await sendTravelQuestion({ destination, history }, question);
      setMessages((prev) => [...prev, { role: "model", text: answer }]);
    } catch (err) {
      console.error("[chat] send failed", err);
      setError(err.message || "The travel assistant is temporarily unavailable. Please try again.");
    } finally {
      setPending(false);
    }
  }

  const panel = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-[var(--color-line)] p-4">
        <p className="font-display text-lg">Travel assistant</p>
        <button
          type="button"
          className="md:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close chat"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <ul ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
        {messages.map((m, i) => (
          <li
            key={i}
            className={clsx(
              "max-w-[85%] px-3 py-2 text-sm",
              m.role === "user"
                ? "ml-auto bg-[var(--color-night)] text-[var(--color-paper)]"
                : "bg-[var(--color-paper-dim)] text-[var(--color-ink)]"
            )}
          >
            {m.text}
          </li>
        ))}
        {pending && (
          <li className="flex items-center gap-2 bg-[var(--color-paper-dim)] px-3 py-2 text-sm text-[var(--color-ink-soft)]">
            <Spinner className="h-3.5 w-3.5" /> Thinking…
          </li>
        )}
        {error && (
          <li role="alert" className="flex items-center gap-2 border border-[var(--color-warn)]/30 px-3 py-2 text-sm text-[var(--color-warn)]">
            <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" /> {error}
          </li>
        )}
      </ul>

      <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-[var(--color-line)] p-3">
        <label htmlFor="chat-input" className="sr-only">
          Ask the travel assistant
        </label>
        <input
          id="chat-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="How many days should I spend here?"
          className="flex-1 border border-[var(--color-line)] px-3 py-2 text-sm outline-none focus-visible:border-[var(--color-route)]"
        />
        <button
          type="submit"
          disabled={pending || !input.trim()}
          className="bg-[var(--color-night)] p-2.5 text-[var(--color-paper)] disabled:opacity-40"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );

  return (
    <>
      {/* Desktop: persistent panel */}
      <div className="hidden h-[520px] border border-[var(--color-line)] lg:block">{panel}</div>

      {/* Mobile: launcher + drawer */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 bg-[var(--color-route)] px-4 py-3 text-sm font-medium text-[var(--color-paper)] shadow-lg"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          Ask the assistant
        </button>

        {open && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/30" role="dialog" aria-modal="true">
            <div className="h-[75vh] bg-[var(--color-paper)]">{panel}</div>
          </div>
        )}
      </div>
    </>
  );
}
