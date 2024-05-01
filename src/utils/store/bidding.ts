import type Stripe from "stripe";
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
  options: Stripe.Response<Stripe.SetupIntent> | null;
  clientSecret: string | null;
  setupIntent: string | null;
  setPrice: (price: number) => void;
  setGuest: (guest: number) => void;
  setDate: (from: Date, to: Date) => void;
  setStep: (step: number) => void;
  resetSession: () => void;
  setOptions: (options: Stripe.Response<Stripe.SetupIntent>) => void;
  setClientSecret: (clientSecret: string) => void;
  setSetupIntent: (setupIntent: string) => void;
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
      options: null,
      clientSecret: null,
      setupIntent: null,
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
        sessionStorage.removeItem("bidding-state");
      },
      setOptions: (options: Stripe.Response<Stripe.SetupIntent>) => {
        set(() => ({ options }));
      },
      setClientSecret: (clientSecret: string) => {
        set(() => ({ clientSecret }));
      },
      setSetupIntent: (setupIntent: string) => {
        set(() => ({ setupIntent }));
      },
    }),
    {
      name: "bidding-state",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
