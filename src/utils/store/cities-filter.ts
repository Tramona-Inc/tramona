import { cities } from "@/components/landing-page/CitiesFilter";
import { type ALL_PROPERTY_ROOM_TYPES } from "@/server/db/schema/tables/properties";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type RoomType = (typeof ALL_PROPERTY_ROOM_TYPES)[number];

export type CitiesLatLong = {
  id: string;
  label: string;
  long: number;
  lat: number;
};

type CitiesFilterState = {
  open: boolean;
  filter: CitiesLatLong | undefined;
  roomType: RoomType | undefined;
  setFilter: (filter: CitiesLatLong | undefined) => void;
  setRoomType: (roomType: RoomType | undefined) => void;
  beds: number;
  bedrooms: number;
  bathrooms: number;
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
};

// export const useBidding = create<BiddingState>((set) => ({
//   price: 0,
//   date: {
//     from: new Date(),
//     to: new Date(),
//   },
//   step: 0,
//   setPrice: (price: number) => {
//     set(() => ({ price }));
//   },
//   setDate: (from: Date, to: Date) => {
//     set(() => ({ date: { from, to } }));
//   },
//   setStep: (step: number) => {
//     set(() => ({ step }));
//   },
// }));

export const useCitiesFilter = create<CitiesFilterState>((set) => ({
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
      filter: cities[0] ?? { id: "all", label: "All", long: 0, lat: 0 }, // Provide a default value if cities[0] is undefined
      roomType: undefined,
      beds: 0,
      bedrooms: 0,
      bathrooms: 0,
      houseRules: [],
    }));
  },
  maxNightlyPrice: 0,
  checkIn: undefined,
  checkOut: undefined,
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
}));
