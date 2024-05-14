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
  filter: CitiesLatLong;
  roomType: RoomType | undefined;
  setFilter: (filter: CitiesLatLong) => void;
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

export const useCitiesFilter = create<CitiesFilterState>()(
  persist(
    (set) => ({
      open: false,
      filter: cities[0] ?? { id: "all", label: "All", long: 0, lat: 0 }, // Provide a default value if cities[0] is undefined
      roomType: undefined,
      beds: 0,
      bedrooms: 0,
      bathrooms: 0,
      houseRules: [],
      setFilter: (filter: CitiesLatLong) => {
        set(() => ({ filter }));
      },
      setRoomType: (roomType: RoomType | undefined) => {
        set(() => ({ roomType }));
      },
      setBeds: (beds: number) => {
        set(() => ({ beds }));
      },
      setBedrooms: (bedrooms: number) => {
        set(() => ({ bedrooms }));
      },
      setBathrooms: (bathrooms: number) => {
        set(() => ({ bathrooms }));
      },
      setHouseRules: (houseRules: string[]) => {
        set(() => ({ houseRules }));
      },
      setOpen: (open: boolean) => {
        set(() => ({ open }));
      },
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
    }),
    {
      name: "cities-filter",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
