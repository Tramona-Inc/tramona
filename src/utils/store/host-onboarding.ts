import {
  type ALL_PROPERTY_ROOM_TYPES,
  type ALL_PROPERTY_TYPES,
} from "@/server/db/schema/tables/properties";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type PropertyType = (typeof ALL_PROPERTY_TYPES)[number];
export type SpaceType = (typeof ALL_PROPERTY_ROOM_TYPES)[number];

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
  listing: {
    propertyType: PropertyType;
    spaceType: SpaceType;
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
  };
  setMaxGuests: (maxGuests: number) => void;
  setBedrooms: (bedrooms: number) => void;
  setBeds: (beds: number) => void;
  setBathrooms: (bathrooms: number) => void;
  setPropertyType: (property: PropertyType) => void;
  setSpaceType: (property: SpaceType) => void;
  setLocation: (location: LocationType) => void;
  setCheckInType: (checkInType: string) => void; // Add this line
  setOtherCheckInType: (otherCheckInType: boolean) => void;
  setCheckIn: (checkIn: string) => void; // Add this line
  setCheckOut: (checkOut: string) => void; // Add this line
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
};

// export const useHostOnboarding = create<HostOnboardingState>(
//   persist(
//     (set) => ({
//       progress: 0,
//       listing: {
//         propertyType: "Other",
//         spaceType: "Other",
//         maxGuests: 1,
//         bedrooms: 1,
//         beds: 1,
//         bathrooms: 1,
//         location: {
//           country: "",
//           street: "",
//           apt: "",
//           city: "",
//           state: "",
//           zipcode: "",
//         },
//         checkInType: "self",
//         otherCheckInType: false,
//         checkIn: "",
//         checkOut: "",
//         amenities: [],
//         otherAmenities: [],
//         imageUrls: [],
//         title: "",
//         description: "",
//         petsAllowed: false,
//         smokingAllowed: false,
//         otherHouseRules: "",
//       },
//       setProgress: (progress: number) => {
//         set((state) => ({ ...state, progress }));
//       },
//       setMaxGuests: (maxGuests: number) => {
//         set((state) => ({
//           ...state,
//           listing: {
//             ...state.listing,
//             maxGuests,
//           },
//         }));
//       },
//       setBedrooms: (bedrooms: number) => {
//         set((state) => ({
//           ...state,
//           listing: {
//             ...state.listing,
//             bedrooms,
//           },
//         }));
//       },
//       setBeds: (beds: number) => {
//         set((state) => ({
//           ...state,
//           listing: {
//             ...state.listing,
//             beds,
//           },
//         }));
//       },
//       setBathrooms: (bathrooms: number) => {
//         set((state) => ({
//           ...state,
//           listing: {
//             ...state.listing,
//             bathrooms,
//           },
//         }));
//       },
//       setPropertyType: (propertyType: PropertyType) => {
//         set((state) => ({
//           ...state,
//           listing: {
//             ...state.listing,
//             propertyType,
//           },
//         }));
//       },
//       setSpaceType: (spaceType: SpaceType) => {
//         set((state) => ({
//           ...state,
//           listing: {
//             ...state.listing,
//             spaceType,
//           },
//         }));
//       },
//       setLocation: (location: LocationType) => {
//         // Define the setLocation setter
//         set((state) => ({
//           ...state,
//           listing: {
//             ...state.listing,
//             location,
//           },
//         }));
//       },
//       setCheckInType: (checkInType: string) => {
//         set((state) => ({
//           ...state,
//           listing: {
//             ...state.listing,
//             checkInType,
//           },
//         }));
//       },
//       setOtherCheckInType: (otherCheckInType: boolean) => {
//         set((state) => ({
//           ...state,
//           listing: {
//             ...state.listing,
//             otherCheckInType,
//           },
//         }));
//       },
//       setCheckIn: (checkIn: string) => {
//         set((state) => ({
//           ...state,
//           listing: {
//             ...state.listing,
//             checkIn,
//           },
//         }));
//       },
//       setCheckOut: (checkOut: string) => {
//         set((state) => ({
//           ...state,
//           listing: {
//             ...state.listing,
//             checkOut,
//           },
//         }));
//       },
//       setAmenity: (amenity: string) => {
//         set((state) => ({
//           ...state,
//           listing: {
//             ...state.listing,
//             amenities: [...state.listing.amenities, amenity],
//           },
//         }));
//       },
//       removeAmenity: (amenity: string) => {
//         set((state) => ({
//           ...state,
//           listing: {
//             ...state.listing,
//             amenities: state.listing.amenities.filter(
//               (item) => item !== amenity,
//             ),
//           },
//         }));
//       },
//       setOtherAmenity: (amenity: string) => {
//         set((state) => ({
//           ...state,
//           listing: {
//             ...state.listing,
//             otherAmenities: [...state.listing.otherAmenities, amenity],
//           },
//         }));
//       },
//       removeOtherAmenity: (amenity: string) => {
//         set((state) => ({
//           ...state,
//           listing: {
//             ...state.listing,
//             otherAmenities: state.listing.otherAmenities.filter(
//               (item) => item !== amenity,
//             ),
//           },
//         }));
//       },
//       setImageUrls: (imageUrls: string[]) => {
//         set((state) => ({
//           ...state,
//           listing: {
//             ...state.listing,
//             imageUrls,
//           },
//         }));
//       },
//       setTitle: (title: string) => {
//         set((state) => ({
//           ...state,
//           listing: {
//             ...state.listing,
//             title,
//           },
//         }));
//       },
//       setDescription: (description: string) => {
//         set((state) => ({
//           ...state,
//           listing: {
//             ...state.listing,
//             description,
//           },
//         }));
//       },
//       setPetsAllowed: (petsAllowed: boolean) => {
//         set((state) => ({
//           ...state,
//           listing: {
//             ...state.listing,
//             petsAllowed,
//           },
//         }));
//       },
//       setSmokingAllowed: (smokingAllowed: boolean) => {
//         set((state) => ({
//           ...state,
//           listing: {
//             ...state.listing,
//             smokingAllowed,
//           },
//         }));
//       },
//       setOtherHouseRules: (otherHouseRules: string) => {
//         set((state) => ({
//           ...state,
//           listing: {
//             ...state.listing,
//             otherHouseRules,
//           },
//         }));
//       },
//     }),
//     {
//       name: "host-onboarding-state",
//       version: 1,
//       storage: localStorage,
//     },
//   ),
// );

export const useHostOnboarding = create<HostOnboardingState>()(
  persist(
    (set) => ({
      progress: 0,
      listing: {
        propertyType: "Other",
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
    }),
    {
      name: "host-onboarding-state", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);
