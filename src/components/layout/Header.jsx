import { createPortal } from "react-dom";
import { NavLink, Link } from "react-router-dom";
import { Compass, MapPin, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { useTravelStore } from "../../store/travelStore";

const links = [
  { to: "/", label: "Home" },
  { to: "/destinations", label: "Explore" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useTravelStore((s) => s.location);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={clsx(
        "sticky top-0 z-40 border-b bg-[var(--color-paper)]/95 backdrop-blur transition-shadow",
        scrolled ? "border-[var(--color-line)] shadow-[0_1px_12px_rgba(23,27,26,0.06)]" : "border-transparent"
      )}
    >
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5">
        <Link to="/" className="group flex items-center gap-2.5" aria-label="Waypoint home">
          <Compass
            className="h-6 w-6 shrink-0 text-[var(--color-route)] transition-transform duration-500 ease-out group-hover:rotate-[135deg]"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <span className="flex flex-col leading-none">
            <span className="font-display text-2xl tracking-tight">Waypoint</span>
            <span className="coord hidden text-[var(--color-ink-soft)] sm:inline">a field guide to the world</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-10 md:flex" aria-label="Primary">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                clsx(
                  "relative py-1 text-sm transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:bg-[var(--color-route)] after:transition-all after:duration-300",
                  isActive
                    ? "text-[var(--color-route)] after:w-full"
                    : "text-[var(--color-ink-soft)] after:w-0 hover:text-[var(--color-ink)] hover:after:w-full"
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-5 md:flex">
          {location && (
            <span className="coord flex items-center gap-1.5 border border-[var(--color-line)] px-2.5 py-1 text-[var(--color-harbor)]">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {location.label}
            </span>
          )}
          <Link
            to="/itinerary"
            className="bg-[var(--color-night)] px-4 py-2 text-sm font-medium text-[var(--color-paper)] transition-colors hover:bg-[var(--color-route)]"
          >
            Plan a trip
          </Link>
        </div>

        <button
          type="button"
          className="md:hidden"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      {createPortal(
        <>
          {/* Backdrop */}
          <div
            aria-hidden="true"
            onClick={() => setOpen(false)}
            className={clsx(
              "fixed inset-0 z-[998] bg-black/40 transition-opacity duration-300 md:hidden",
              open ? "opacity-100" : "pointer-events-none opacity-0"
            )}
          />

          {/* Drawer */}
          <div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className={clsx(
              "fixed right-0 top-0 z-[999] flex h-full w-[78%] max-w-xs flex-col overflow-y-auto shadow-2xl transition-transform duration-300 ease-out md:hidden",
              open ? "translate-x-0" : "translate-x-full"
            )}
            style={{ backgroundColor: "#ffffff" }}
          >
            <div className="flex h-20 shrink-0 items-center justify-between px-5">
              <span className="flex items-center gap-2.5">
                <Compass className="h-6 w-6" style={{ color: "#c2410c" }} strokeWidth={1.5} aria-hidden="true" />
                <span className="font-display text-xl" style={{ color: "#1a1f1e" }}>Waypoint</span>
              </span>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu">
                <X className="h-6 w-6" style={{ color: "#1a1f1e" }} aria-hidden="true" />
              </button>
            </div>

            <nav className="flex flex-1 flex-col gap-1 px-5 pt-4" aria-label="Primary">
              {[...links, { to: "/itinerary", label: "Plan a trip" }].map((link, i) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between border-t border-[#e5e0d8] py-4 font-display text-xl first:border-none"
                  style={({ isActive }) => ({
                    color: isActive ? "#c2410c" : "#1a1f1e",
                  })}
                >
                  {link.label}
                  <span className="text-sm" style={{ color: "#8a8a82" }}>0{i + 1}</span>
                </NavLink>
              ))}
            </nav>

            <div className="shrink-0 border-t border-[#e5e0d8] px-5 py-6">
              {location ? (
                <p className="flex items-center gap-1.5" style={{ color: "#1a1f1e" }}>
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  {location.label}
                </p>
              ) : (
                <p style={{ color: "#8a8a82" }}>Location not set</p>
              )}
            </div>
          </div>
        </>,
        document.body
      )}
    </header>
  );
}