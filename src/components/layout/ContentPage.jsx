import { PageShell } from "./PageShell";

export function ContentPage({ title, subtitle, children, className = "" }) {
  return (
    <PageShell className={className}>
      <h1 className="font-display text-4xl">{title}</h1>
      {subtitle && <p className="mt-2 max-w-xl text-[var(--color-ink-soft)]">{subtitle}</p>}
      <div className="mt-10 rule pt-10">{children}</div>
    </PageShell>
  );
}
