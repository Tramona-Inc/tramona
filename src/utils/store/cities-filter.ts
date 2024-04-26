import { cities } from "@/components/landing-page/CitiesFilter";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CitiesLatLong = {
  id: string;
  label: string;
  long: number;
  lat: number;
};

type CitiesFilterState = {
  open: boolean;
  filter: CitiesLatLong;
  placeType: string;
  setFilter: (filter: CitiesLatLong) => void;
  setPlaceType: (placeType: string) => void;
  beds: number;
  bedrooms: number;
  bathrooms: number;
  setBeds: (beds: number) => void;
  setBedrooms: (bedrooms: number) => void;
  setBathrooms: (bathrooms: number) => void;
  houseRules: string[];
  setHouseRules: (houseRules: string[]) => void;
  setOpen: (open: boolean) => void;
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
      filter: cities[0] ?? { id: "", label: "", long: 0, lat: 0 }, // Provide a default value if cities[0] is undefined
      placeType: "Flexible",
      beds: 0,
      bedrooms: 0,
      bathrooms: 0,
      houseRules: [],
      setFilter: (filter: CitiesLatLong) => {
        set(() => ({ filter }));
      },
      setPlaceType: (placeType: string) => {
        set(() => ({ placeType }));
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
    }),
    {
      name: "cities-filter",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
