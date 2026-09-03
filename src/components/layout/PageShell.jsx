export function PageShell({ children, className = "" }) {
  return <main className={`mx-auto max-w-6xl px-5 py-12 ${className}`}>{children}</main>;
}
