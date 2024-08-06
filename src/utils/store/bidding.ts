import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type BiddingState = {
  displayUserBid: boolean;
  propertyIdBids: number[];
  price: number;
  guest: number;
  date: {
    from: Date;
    to: Date;
  };
  step: number;
  setDisplayUserBid: (displayUserBid: boolean) => void;
  setInitialBids: (initialBids: number[]) => void; // Add setInitialBids function
  addPropertyIdBids: (ids: number) => void;
  setPrice: (price: number) => void;
  setGuest: (guest: number) => void;
  setDate: (from: Date, to: Date) => void;
  setStep: (step: number) => void;
  resetSession: () => void;
};

export const useBidding = create<BiddingState>()(
  persist(
    (set) => ({
      displayUserBid: false,
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
        set((state) => ({ ...state, price }));
      },
      setGuest: (guest: number) => {
        set((state) => ({ ...state, guest }));
      },
      setDate: (from: Date, to: Date) => {
        set((state) => ({ ...state, date: { from, to } }));
      },
      setStep: (step: number) => {
        set((state) => ({ ...state, step }));
      },
      setDisplayUserBid: (displayUserBid: boolean) => {
        set((state) => ({ ...state, displayUserBid }));
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
