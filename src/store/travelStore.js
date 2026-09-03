import { create } from "zustand";

// source: 'geolocation' | 'search' | 'destination' | null
export const useTravelStore = create((set) => ({
  location: null, // { lat, lng, label, source }
  locationStatus: "idle", // 'idle' | 'requesting' | 'granted' | 'denied' | 'unavailable'

  setLocation: (location) => set({ location }),
  setLocationStatus: (locationStatus) => set({ locationStatus }),

  savedInterests: [],
  toggleInterest: (interest) =>
    set((state) => ({
      savedInterests: state.savedInterests.includes(interest)
        ? state.savedInterests.filter((i) => i !== interest)
        : [...state.savedInterests, interest],
    })),
}));
