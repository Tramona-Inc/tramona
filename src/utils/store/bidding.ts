import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type BiddingState = {
  propertyIdBids: number[];
  price: number;
  guest: number;
  date: {
    from: Date;
    to: Date;
  };
  step: number;
  setInitialBids: (initialBids: number[]) => void; // Add setInitialBids function
  addPropertyIdBids: (ids: number) => void;
  setPrice: (price: number) => void;
  setGuest: (guest: number) => void;
  setDate: (from: Date, to: Date) => void;
  setStep: (step: number) => void;
  resetSession: () => void;
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

export const useBidding = create<BiddingState>()(
  persist(
    (set) => ({
      propertyIdBids: [],
      price: 0,
      guest: 1,
      date: {
        from: new Date(),
        to: new Date(),
      },
      step: 0,
      setInitialBids: (initialBids: number[]) => {
        set((state) => ({
          ...state,
          propertyIdBids: initialBids,
        }));
      },
      addPropertyIdBids: (id) => {
        set((state) => ({
          ...state,
          propertyIdBids: [...state.propertyIdBids, id],
        }));
      },
      setPrice: (price: number) => {
        set(() => ({ price }));
      },
      setGuest: (guest: number) => {
        set(() => ({ guest }));
      },
      setDate: (from: Date, to: Date) => {
        set(() => ({ date: { from, to } }));
      },
      setStep: (step: number) => {
        set(() => ({ step }));
      },
      resetSession: () => {
        set(() => ({
          price: 0,
          guest: 1,
          date: {
            from: new Date(),
            to: new Date(),
          },
          step: 0,
        }));
      },
    }),
    {
      name: "bidding-state",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

