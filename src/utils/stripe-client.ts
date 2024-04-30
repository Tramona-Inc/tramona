import { env } from '@/env';
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { useMemo } from "react";

export const useStripe = () => {
  const stripe = useMemo<Promise<Stripe | null>>(
    () => loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
    [],
  );

  return stripe;
};
