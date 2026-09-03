import { Outlet } from "react-router-dom";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";

export function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-[var(--color-night)] focus:px-4 focus:py-2 focus:text-[var(--color-paper)]"
      >
        Skip to content
      </a>
      <Header />
      <div id="main-content" className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
