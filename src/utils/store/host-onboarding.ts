import { create } from "zustand";

export type PropertyType = "apartment" | "home" | "hotels" | "alternative" | "";
export type SpaceType = "entire" | "single" | "shared" | "alternative" | "";
export type LocationType = {
  country: string;
  street: string;
  apt: string | null;
  city: string;
  state: string;
  zipcode: string;
};

type HostOnboardingState = {
  progress: number;
  setProgress: (progress: number) => void;
  listing: {
    propertyType: PropertyType;
    spaceType: SpaceType;
    maxGuests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
    location: LocationType;
    checkInType: string;
    checkIn: string;
    checkOut: string;
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
  setPropertyType: (property: PropertyType) => void;
  setSpaceType: (property: SpaceType) => void;
  setLocation: (location: LocationType) => void;
  setCheckInType: (checkInType: string) => void; // Add this line
  setCheckIn: (checkIn: string) => void; // Add this line
  setCheckOut: (checkOut: string) => void; // Add this line
};

export const useHostOnboarding = create<HostOnboardingState>((set) => ({
  progress: 0,
  listing: {
    propertyType: "",
    spaceType: "",
    maxGuests: 1,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    location: {
      country: "",
      street: "",
      apt: "",
      city: "",
      state: "",
      zipcode: "",
    },
    checkInType: "self",
    checkIn: "",
    checkOut: "",
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
  setPropertyType: (propertyType: PropertyType) => {
    set((state) => ({
      ...state,
      listing: {
        ...state.listing,
        propertyType,
      },
    }));
  },
  setSpaceType: (spaceType: SpaceType) => {
    set((state) => ({
      ...state,
      listing: {
        ...state.listing,
        spaceType,
      },
    }));
  },
  setLocation: (location: LocationType) => {
    // Define the setLocation setter
    set((state) => ({
      ...state,
      listing: {
        ...state.listing,
        location,
      },
    }));
  },
  setCheckInType: (checkInType: string) => {
    set((state) => ({
      ...state,
      listing: {
        ...state.listing,
        checkInType,
      },
    }));
  },
  setCheckIn: (checkIn: string) => {
    set((state) => ({
      ...state,
      listing: {
        ...state.listing,
        checkIn,
      },
    }));
  },
  setCheckOut: (checkOut: string) => {
    set((state) => ({
      ...state,
      listing: {
        ...state.listing,
        checkOut,
      },
    }));
  },
}));
