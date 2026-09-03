import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./RootLayout";
import { Home } from "../pages/Home";
import { Destinations } from "../pages/Destinations";
import { DestinationDetails } from "../pages/DestinationDetails";
import { Itinerary } from "../pages/Itinerary";
import { NotFound } from "../pages/NotFound";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/destinations", element: <Destinations /> },
      { path: "/destinations/:slug", element: <DestinationDetails /> },
      { path: "/itinerary", element: <Itinerary /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
