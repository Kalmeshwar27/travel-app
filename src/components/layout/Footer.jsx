export function Footer() {
  return (
    <footer className="rule mt-24 bg-night py-16 text-white">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="sm:col-span-2 md:col-span-1">
            <p className="font-display text-lg">Waypoint</p>
            <p className="mt-3 max-w-xs text-sm text-white/60">
              Plan your next trip, discover new places, and travel with a clear route in mind.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-white/40">
              Explore
            </p>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li><a href="/" className="hover:text-white">Home</a></li>
              <li><a href="/plan" className="hover:text-white">Plan a Trip</a></li>
              <li><a href="/explore" className="hover:text-white">Explore</a></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-white/40">
              Support
            </p>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li><a href="/help-center" className="hover:text-white">Help Center</a></li>
              <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
              <li><a href="/faqs" className="hover:text-white">FAQs</a></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-white/40">
              Legal
            </p>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li><a href="/privacy" className="hover:text-white">Privacy</a></li>
              <li><a href="/terms" className="hover:text-white">Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-2 border-t border-white/10 pt-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="coord whitespace-nowrap text-white/40">
            © {new Date().getFullYear()} Kalmeshwar. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-white/60">
            <a href="#" className="hover:text-white">Instagram</a>
            <a href="#" className="hover:text-white">Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  );
}