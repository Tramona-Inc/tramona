import { create } from "zustand";

interface IsStripeConnectInstanceReady {
  isStripeConnectInstanceReady: boolean;
  setStripeConnectInstanceReady: (ready: boolean) => void;
}

const useIsStripeConnectInstanceReady = create<IsStripeConnectInstanceReady>(
  (set) => ({
    isStripeConnectInstanceReady: false,
    setStripeConnectInstanceReady: (ready: boolean) =>
      set({ isStripeConnectInstanceReady: ready }),
  }),
);

export default useIsStripeConnectInstanceReady;
