import { AlertTriangle, Compass, Loader2, RefreshCw } from "lucide-react";
import clsx from "clsx";

export function Button({ as: Tag = "button", variant = "primary", className, children, ...props }) {
  const base =
    "inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2";
  const variants = {
    primary: "bg-[var(--color-night)] text-[var(--color-paper)] hover:bg-[var(--color-night-soft)]",
    outline:
      "border border-[var(--color-ink)] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]",
    ghost: "text-[var(--color-ink)] hover:text-[var(--color-route)]",
    route: "bg-[var(--color-route)] text-[var(--color-paper)] hover:bg-[var(--color-route-soft)]",
  };
  return (
    <Tag className={clsx(base, variants[variant], className)} {...props}>
      {children}
    </Tag>
  );
}

export function Badge({ children, className }) {
  return (
    <span
      className={clsx(
        "coord inline-flex items-center gap-1 border border-[var(--color-line)] px-2 py-0.5",
        className
      )}
    >
      {children}
    </span>
  );
}

export function Spinner({ className }) {
  return <Loader2 className={clsx("animate-spin", className)} aria-hidden="true" />;
}

export function EmptyState({ icon: Icon = Compass, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <Icon className="h-8 w-8 text-[var(--color-ink-soft)]" aria-hidden="true" />
      <p className="font-display text-xl">{title}</p>
      {message && <p className="max-w-sm text-sm text-[var(--color-ink-soft)]">{message}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ title = "Something went wrong", message, onRetry, children }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 border border-[var(--color-warn)]/30 bg-[var(--color-warn)]/5 py-10 text-center"
    >
      <AlertTriangle className="h-6 w-6 text-[var(--color-warn)]" aria-hidden="true" />
      <p className="font-medium text-[var(--color-warn)]">{title}</p>
      {message && <p className="max-w-sm text-sm text-[var(--color-ink-soft)]">{message}</p>}
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="mt-1">
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Try again
        </Button>
      )}
      {children}
    </div>
  );
}

export function SkeletonBlock({ className }) {
  return <div className={clsx("skeleton", className)} aria-hidden="true" />;
}
