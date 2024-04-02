import { create } from "zustand";

type HostOnboardingState = {
  progress: number;
  listing: {
    propertyType: "apartment" | "home" | "hotels" | "other";
    spaceType: "entire" | "single" | "shared";
    maxGuest: number;
    bedroom: number;
    bed: number;
    bathroom: number;
    location: string;
    checkInType: string;
    checkIn: Date;
    checkOut: Date;
  };
};

export const useHostOnboarding = create<HostOnboardingState>((set) => ({}));
