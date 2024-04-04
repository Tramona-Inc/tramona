import { create } from "zustand";

type HostOnboardingState = {
  progress: number;
  setProgress: (progress: number) => void;
  listing: {
    propertyType: "apartment" | "home" | "hotels" | "other";
    spaceType: "entire" | "single" | "shared";
    maxGuests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
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
  setMaxGuests: (maxGuests: number) => void;
  setBedrooms: (bedrooms: number) => void;
  setBeds: (beds: number) => void;
  setBathrooms: (bathrooms: number) => void;
};

export const useHostOnboarding = create<HostOnboardingState>((set) => ({
  progress: 0,
  listing: {
    propertyType: "apartment",
    spaceType: "entire",
    maxGuests: 1,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
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
    otherHouseRules: "",
  },
  setProgress: (progress: number) => {
    set((state) => ({ ...state, progress }));
  },
  setMaxGuests: (maxGuests: number) => {
    set((state) => ({
      ...state,
      listing: {
        ...state.listing,
        maxGuests,
      },
    }));
  },
  setBedrooms: (bedrooms: number) => {
    set((state) => ({
      ...state,
      listing: {
        ...state.listing,
        bedrooms,
      },
    }));
  },
  setBeds: (beds: number) => {
    set((state) => ({
      ...state,
      listing: {
        ...state.listing,
        beds,
      },
    }));
  },
  setBathrooms: (bathrooms: number) => {
    set((state) => ({
      ...state,
      listing: {
        ...state.listing,
        bathrooms,
      },
    }));
  },
}));
