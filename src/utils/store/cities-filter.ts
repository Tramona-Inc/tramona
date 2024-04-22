import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type CitiesFilterState = {
  filter: string;
  setFilter: (filter: string) => void;
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
      setFilter: (filter: string) => {
        set(() => ({ filter }));
      },
    }),
    {
      name: "cities-filter",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
