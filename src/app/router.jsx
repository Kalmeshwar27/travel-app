import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./RootLayout";
import { Home } from "../pages/Home";
import { Destinations } from "../pages/Destinations";
import { DestinationDetails } from "../pages/DestinationDetails";
import { Itinerary } from "../pages/Itinerary";
import { HelpCenter } from "../pages/HelpCenter";
import { ContactUs } from "../pages/ContactUs";
import { FAQs } from "../pages/FAQs";
import { Privacy } from "../pages/Privacy";
import { Terms } from "../pages/Privacy";
import { NotFound } from "../pages/NotFound";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/destinations", element: <Destinations /> },
      { path: "/explore", element: <Destinations /> },
      { path: "/destinations/:slug", element: <DestinationDetails /> },
      { path: "/itinerary", element: <Itinerary /> },
      { path: "/plan", element: <Itinerary /> },
      { path: "/help-center", element: <HelpCenter /> },
      { path: "/contact", element: <ContactUs /> },
      { path: "/faqs", element: <FAQs /> },
      { path: "/privacy", element: <Privacy /> },
      { path: "/terms", element: <Terms /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
