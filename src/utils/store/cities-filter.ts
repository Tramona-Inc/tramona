import { type ALL_PROPERTY_ROOM_TYPES } from "@/server/db/schema/tables/properties";
import { create } from "zustand";

type RoomType = (typeof ALL_PROPERTY_ROOM_TYPES)[number];

export type CitiesLatLong = {
  id: string;
  label: string;
  long: number;
  lat: number;
};

type LocationBoundingBoxType = {
  northeastLat: number;
  northeastLng: number;
  southwestLat: number;
  southwestLng: number;
};

type CitiesFilterState = {
  locationBoundingBox: LocationBoundingBoxType;
  radius: number;
  open: boolean;
  filter: CitiesLatLong | undefined;
  roomType: RoomType | undefined;
  setFilter: (filter: CitiesLatLong | undefined) => void;
  setRoomType: (roomType: RoomType | undefined) => void;
  beds: number;
  bedrooms: number;
  bathrooms: number;
  setRadius: (radius: number) => void;
  setBeds: (beds: number) => void;
  setBedrooms: (bedrooms: number) => void;
  setBathrooms: (bathrooms: number) => void;
  houseRules: string[];
  setHouseRules: (houseRules: string[]) => void;
  setOpen: (open: boolean) => void;
  clearFilter: () => void;
  guests: number;
  setGuests: (guests: number) => void;
  maxNightlyPrice: number | undefined;
  setMaxNightlyPrice: (maxNightlyPrice: number | undefined) => void;
  checkIn: Date | undefined;
  setCheckIn: (checkIn: Date | undefined) => void;
  checkOut: Date | undefined;
  setCheckOut: (checkOut: Date | undefined) => void;
  setLocationBoundingBox: (
    locationBoundingBox: LocationBoundingBoxType,
  ) => void;
};

export const useCitiesFilter = create<CitiesFilterState>((set) => ({
  locationBoundingBox: {
    northeastLat: 0,
    northeastLng: 0,
    southwestLat: 0,
    southwestLng: 0,
  },
  radius: 50,
  open: false,
  filter: undefined,
  roomType: undefined,
  beds: 0,
  bedrooms: 0,
  bathrooms: 0,
  guests: 0,
  houseRules: [],
  clearFilter: () => {
    set((state) => ({
      ...state,
      roomType: undefined,
      beds: 0,
      bedrooms: 0,
      bathrooms: 0,
      houseRules: [],
      radius: 50,
      checkIn: undefined,
      checkOut: undefined,
      guests: 0,
      maxNightlyPrice: undefined,
    }));
  },
  maxNightlyPrice: 0,
  checkIn: undefined,
  checkOut: undefined,
  setRadius: (radius) => set(() => ({ radius })),
  setFilter: (filter) => set(() => ({ filter })),
  setRoomType: (roomType) => set(() => ({ roomType })),
  setBeds: (beds) => set(() => ({ beds })),
  setBedrooms: (bedrooms) => set(() => ({ bedrooms })),
  setBathrooms: (bathrooms) => set(() => ({ bathrooms })),
  setHouseRules: (houseRules) => set(() => ({ houseRules })),
  setOpen: (open) => set(() => ({ open })),
  setGuests: (guests) => set(() => ({ guests })),
  setMaxNightlyPrice: (maxNightlyPrice) => set(() => ({ maxNightlyPrice })),
  setCheckIn: (checkIn) => set(() => ({ checkIn })),
  setCheckOut: (checkOut) => set(() => ({ checkOut })),
  setLocationBoundingBox: (locationBoundingBox) =>
    set(() => ({ locationBoundingBox })),
}));
