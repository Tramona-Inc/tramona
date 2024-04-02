import { create } from "zustand";

type HostOnboardingState = {
  progress: number;
  setProgress: (progress: number) => void;
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
    amenities: string[];
    imageUrls: string[];
    title: string;
    description: string;
    petsAllowed: boolean;
    smokingAllowed: boolean;
    otherHouseRules: string;
  };
};

export const useHostOnboarding = create<HostOnboardingState>((set) => ({
  progress: 0,
  listing: {
    propertyType: "apartment",
    spaceType: "entire",
    maxGuest: 0,
    bedroom: 0,
    bed: 0,
    bathroom: 0,
    location: "",
    checkInType: "",
    checkIn: new Date(),
    checkOut: new Date(),
    amenities: [],
    imageUrls: [],
    title: "",
    description: "",
    petsAllowed: false,
    smokingAllowed: false,
    otherHouseRules: ""
  },
  setProgress: (progress: number) => {
    set((state) => ({ ...state, progress }));
  },
}));
