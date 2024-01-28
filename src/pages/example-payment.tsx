import { Button } from "@/components/ui/button";
import { env } from "@/env";
import { api } from "@/utils/api";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { useMemo } from "react";

const useStripe = () => {
  const stripe = useMemo<Promise<Stripe | null>>(
    () => loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
    [],
  );

  return stripe;
};

export default function ExamplePayment() {
  const createCheckout = api.stripe.createCheckoutSession.useMutation();
  const stripePromise = useStripe();

  async function checkout() {
    const response = await createCheckout.mutateAsync({
      name: "hello",
      price: 2000,
    });

    const stripe = await stripePromise;

    if (stripe !== null) {
      await stripe.redirectToCheckout({
        sessionId: response.id,
      });
    }
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      Example Payment
      <Button onClick={() => checkout()}>Create session</Button>
    </div>
  );
}
