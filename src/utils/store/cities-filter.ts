import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type CitiesFilterState = {
  filter: string;
  placeType: string;
  setFilter: (filter: string) => void;
  setPlaceType: (placeType: string) => void;
  beds: number;
  bedrooms: number;
  bathrooms: number;
  setBeds: (beds: number) => void;
  setBedrooms: (bedrooms: number) => void;
  setBathrooms: (bathrooms: number) => void;
  houseRules: string[];
  setHouseRules: (houseRules: string[]) => void;
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
      filter: "All",
      placeType: "Flexible",
      beds: 0,
      bedrooms: 0,
      bathrooms: 0,
      houseRules: [],
      setFilter: (filter: string) => {
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
    }),
    {
      name: "cities-filter",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
