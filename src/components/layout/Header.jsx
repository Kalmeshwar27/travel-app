import { NavLink } from "react-router-dom";
import { MapPin, Menu, X } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import { useTravelStore } from "../../store/travelStore";

const links = [
  { to: "/", label: "Home" },
  { to: "/destinations", label: "Explore" },
  { to: "/itinerary", label: "Plan a trip" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const location = useTravelStore((s) => s.location);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-line)] bg-[var(--color-paper)]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <NavLink to="/" className="font-display text-xl tracking-tight" aria-label="Waypoint home">
          Waypoint
        </NavLink>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                clsx(
                  "text-sm transition-colors hover:text-[var(--color-route)]",
                  isActive ? "text-[var(--color-route)]" : "text-[var(--color-ink-soft)]"
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {location && (
            <span className="coord flex items-center gap-1 text-[var(--color-harbor)]">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {location.label}
            </span>
          )}
        </div>

        <button
          type="button"
          className="md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" className="border-t border-[var(--color-line)] px-5 py-4 md:hidden" aria-label="Primary">
          <ul className="flex flex-col gap-4">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === "/"}
                  onClick={() => setOpen(false)}
                  className="text-base"
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
