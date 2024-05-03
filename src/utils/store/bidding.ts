import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type BiddingState = {
  price: number;
  guest: number;
  date: {
    from: Date;
    to: Date;
  };
  step: number;
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
      price: 0,
      guest: 1,
      date: {
        from: new Date(),
        to: new Date(),
      },
      step: 0,
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
