import {
  CancellationPolicyWithInternals,
  Property,
  type PropertyRoomType,
  type PropertyType,
} from "@/server/db/schema";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type LocationType = {
  country: string;
  street: string;
  apt: string | null | undefined;
  city: string;
  state: string;
  zipcode: string;
};

type HostOnboardingState = {
  progress: number;
  setProgress: (progress: number) => void;
  isEdit: boolean;
  listing: {
    propertyType: PropertyType;
    cancellationPolicy: CancellationPolicyWithInternals | null;
    spaceType: PropertyRoomType;
    maxGuests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
    location: LocationType;
    checkInType: string;
    otherCheckInType: boolean;
    checkIn: string;
    checkOut: string;
    amenities: string[];
    otherAmenities: string[];
    imageUrls: string[];
    title: string;
    description: string;
    petsAllowed: boolean;
    smokingAllowed: boolean;
    otherHouseRules: string | null | undefined;
    originalListingId: string | null | undefined;
    originalListingPlatform: Property["originalListingPlatform"] | undefined;
    airbnbUrl: string;
    bookItNowEnabled: boolean;
  };
  setIsEdit: (isEdit: boolean) => void;
  setMaxGuests: (maxGuests: number) => void;
  setBedrooms: (bedrooms: number) => void;
  setBeds: (beds: number) => void;
  setBathrooms: (bathrooms: number) => void;
  setPropertyType: (property: PropertyType) => void;
  setCancellationPolicy: (
    cancellationPolicy: CancellationPolicyWithInternals | null,
  ) => void;
  setSpaceType: (property: PropertyRoomType) => void;
  setLocation: (location: LocationType) => void;
  setCheckInType: (checkInType: string) => void; // Add this line
  setOtherCheckInType: (otherCheckInType: boolean) => void;
  setCheckIn: (checkIn: string) => void; // Add this line
  setCheckOut: (checkOut: string) => void; // Add this line
  setAmenities: (amenities: string[]) => void;
  setOtherAmenities: (otherAmenities: string[]) => void;
  setAmenity: (amenity: string) => void;
  removeAmenity: (amenity: string) => void;
  setOtherAmenity: (amenity: string) => void;
  removeOtherAmenity: (amenity: string) => void;
  setImageUrls: (imageUrls: string[]) => void;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setPetsAllowed: (petsAllowed: boolean) => void;
  setSmokingAllowed: (smokingAllowed: boolean) => void;
  setOtherHouseRules: (otherHouseRules: string) => void;
  setOriginalListingId: (originalListingId: string) => void;
  setOriginalListingPlatform: (
    originalListingPlatform: Property["originalListingPlatform"],
  ) => void;
  setAirbnbUrl: (airbnbUrl: string) => void;
  setBookItNowEnabled: (bookItNowEnabled: boolean) => void;
  resetSession: () => void;
};

export const useHostOnboarding = create<HostOnboardingState>()(
  persist(
    (set) => ({
      progress: 0,
      isEdit: false,
      listing: {
        propertyType: "Other",
        cancellationPolicy: "Flexible",
        spaceType: "Other",
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
        otherCheckInType: false,
        checkIn: "",
        checkOut: "",
        amenities: [],
        otherAmenities: [],
        imageUrls: [],
        title: "",
        description: "",
        petsAllowed: false,
        smokingAllowed: false,
        otherHouseRules: "",
        originalListingId: null,
        originalListingPlatform: undefined,
        airbnbUrl: "",
        bookItNowEnabled: false,
      },
      setIsEdit: (isEdit: boolean) => {
        set((state) => ({ ...state, isEdit }));
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
      setCancellationPolicy: (
        cancellationPolicy: CancellationPolicyWithInternals | null,
      ) => {
        set((state) => ({
          ...state,
          listing: {
            ...state.listing,
            cancellationPolicy,
          },
        }));
      },
      setSpaceType: (spaceType: PropertyRoomType) => {
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
      setOtherCheckInType: (otherCheckInType: boolean) => {
        set((state) => ({
          ...state,
          listing: {
            ...state.listing,
            otherCheckInType,
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
      setAmenities: (amenities: string[]) => {
        set((state) => ({
          ...state,
          listing: {
            ...state.listing,
            amenities,
          },
        }));
      },
      setAmenity: (amenity: string) => {
        set((state) => ({
          ...state,
          listing: {
            ...state.listing,
            amenities: [...state.listing.amenities, amenity],
          },
        }));
      },
      removeAmenity: (amenity: string) => {
        set((state) => ({
          ...state,
          listing: {
            ...state.listing,
            amenities: state.listing.amenities.filter(
              (item) => item !== amenity,
            ),
          },
        }));
      },
      setOtherAmenities: (otherAmenities: string[]) => {
        set((state) => ({
          ...state,
          listing: {
            ...state.listing,
            otherAmenities,
          },
        }));
      },
      setOtherAmenity: (amenity: string) => {
        set((state) => ({
          ...state,
          listing: {
            ...state.listing,
            otherAmenities: [...state.listing.otherAmenities, amenity],
          },
        }));
      },
      removeOtherAmenity: (amenity: string) => {
        set((state) => ({
          ...state,
          listing: {
            ...state.listing,
            otherAmenities: state.listing.otherAmenities.filter(
              (item) => item !== amenity,
            ),
          },
        }));
      },
      setImageUrls: (imageUrls: string[]) => {
        set((state) => ({
          ...state,
          listing: {
            ...state.listing,
            imageUrls,
          },
        }));
      },
      setTitle: (title: string) => {
        set((state) => ({
          ...state,
          listing: {
            ...state.listing,
            title,
          },
        }));
      },
      setDescription: (description: string) => {
        set((state) => ({
          ...state,
          listing: {
            ...state.listing,
            description,
          },
        }));
      },
      setPetsAllowed: (petsAllowed: boolean) => {
        set((state) => ({
          ...state,
          listing: {
            ...state.listing,
            petsAllowed,
          },
        }));
      },
      setSmokingAllowed: (smokingAllowed: boolean) => {
        set((state) => ({
          ...state,
          listing: {
            ...state.listing,
            smokingAllowed,
          },
        }));
      },
      setOtherHouseRules: (otherHouseRules: string) => {
        set((state) => ({
          ...state,
          listing: {
            ...state.listing,
            otherHouseRules,
          },
        }));
      },
      setOriginalListingId: (originalListingId: string) => {
        set((state) => ({
          ...state,
          listing: {
            ...state.listing,
            originalListingId,
          },
        }));
      },
      setOriginalListingPlatform: (
        originalListingPlatform: Property["originalListingPlatform"],
      ) => {
        set((state) => ({
          ...state,
          listing: {
            ...state.listing,
            originalListingPlatform,
          },
        }));
      },
      setAirbnbUrl: (airbnbUrl: string) => {
        set((state) => ({
          ...state,
          listing: {
            ...state.listing,
            airbnbUrl,
          },
        }));
      },
      setBookItNowEnabled: (bookItNowEnabled: boolean) => {
        set((state) => ({
          ...state,
          listing: {
            ...state.listing,
            bookItNowEnabled,
          },
        }));
      },
      resetSession: () => {
        sessionStorage.removeItem("host-onboarding-state");
      },
    }),
    {
      name: "host-onboarding-state", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);
