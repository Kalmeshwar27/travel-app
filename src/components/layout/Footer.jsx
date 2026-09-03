export function Footer() {
  return (
    <footer className="rule mt-24 bg-night py-10 text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-5 text-center">
        <p className="font-display text-lg">
          Waypoint
        </p>

        <p className="coord whitespace-nowrap text-white/10">
          © {new Date().getFullYear()} Kalmeshwar. All rights reserved.
        </p>
      </div>
    </footer>
  );
}