export function Footer() {
  return (
    <footer className="rule mt-24 bg-night py-10 text-white">
      <div className="relative mx-auto max-w-6xl px-5">
        <p className="font-display text-lg">
          Waypoint
        </p>

        <p className="coord absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-white/10">
          © {new Date().getFullYear()} Kalmeshwar. All rights reserved.
        </p>
      </div>
    </footer>
  );
}