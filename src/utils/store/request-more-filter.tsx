import { type ALL_PROPERTY_ROOM_TYPES } from "@/server/db/schema/tables/properties";
import { create } from "zustand";

type RoomType = (typeof ALL_PROPERTY_ROOM_TYPES)[number];


type UseRequestMoreFilter = {
  radius: number;
  open: boolean;
  roomType: RoomType | undefined;
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

export const useRequestMoreFilter = create<UseRequestMoreFilter>((set) => ({
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
    }));
  },
  checkIn: undefined,
  checkOut: undefined,
  setRadius: (radius) => set(() => ({ radius })),
  setRoomType: (roomType) => set(() => ({ roomType })),
  setBeds: (beds) => set(() => ({ beds })),
  setBedrooms: (bedrooms) => set(() => ({ bedrooms })),
  setBathrooms: (bathrooms) => set(() => ({ bathrooms })),
  setHouseRules: (houseRules) => set(() => ({ houseRules })),
  setOpen: (open) => set(() => ({ open })),
  setGuests: (guests) => set(() => ({ guests })),
}));
