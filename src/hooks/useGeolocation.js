import { useCallback } from "react";
import { useTravelStore } from "../store/travelStore";
import { reverseGeocode } from "../services/geocodingApi";

export function useGeolocation() {
  const location = useTravelStore((s) => s.location);
  const status = useTravelStore((s) => s.locationStatus);
  const setLocation = useTravelStore((s) => s.setLocation);
  const setStatus = useTravelStore((s) => s.setLocationStatus);

  const requestLocation = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setStatus("unavailable");
      return;
    }
    setStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setLocation({ lat, lng, label: "Your location", source: "geolocation" });
        setStatus("granted");

        // Fill in a real place name once reverse-geocoding resolves;
        // the pin/weather already work with just lat/lng in the meantime.
        reverseGeocode(lat, lng).then((label) => {
          if (label) setLocation({ lat, lng, label, source: "geolocation" });
        });
      },
      (error) => {
        setStatus(error.code === error.PERMISSION_DENIED ? "denied" : "unavailable");
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 5 * 60 * 1000 }
    );
  }, [setLocation, setStatus]);

  const setManualLocation = useCallback(
    (place) => {
      setLocation({ lat: place.lat, lng: place.lng, label: place.label, source: "search" });
      setStatus("granted");
    },
    [setLocation, setStatus]
  );

  return { location, status, requestLocation, setManualLocation };
}