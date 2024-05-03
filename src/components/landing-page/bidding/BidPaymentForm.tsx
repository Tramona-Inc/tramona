import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { useBidding } from "@/utils/store/bidding";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

type Bid = {
  propertyId: number;
  numGuests: number;
  amount: number;
  checkIn: Date;
  checkOut: Date;
};

export default function BidPaymentForm({ bid }: { bid: Bid }) {
  const step = useBidding((state) => state.step);
  const setStep = useBidding((state) => state.setStep);

  const { mutateAsync: confirmSetupIntentMutation } =
    api.stripe.confirmSetupIntent.useMutation();

  const { mutateAsync: createSetupIntentMutation } =
    api.stripe.createSetupIntent.useMutation();

  const { mutateAsync: createBiddingMutate } = api.biddings.create.useMutation({
    onSuccess: () => {
      setStep(step + 1);
    },
  });

  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { update } = useSession();


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    // Submit payment details to Stripe.
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message ?? "An error occurred.");
      return;
    }

    // Create payment method using the elements.
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      elements,
    });

    if (error) {
      setErrorMessage(error.message ?? "An error occurred.");
      return;
    }

    if (!paymentMethod) {
      setErrorMessage("Failed to create payment method.");
      return;
    }

    // If payment method is successfully created, proceed with setup intent confirmation.
    const setupIntent = await createSetupIntentMutation({
      paymentMethod: paymentMethod.id,
    });

    void await update();

    if (setupIntent) {
      await confirmSetupIntentMutation({
        setupIntent: setupIntent.id,
      });
    }

    // Create bidding after confirming setup intent.
    void createBiddingMutate({ ...bid });
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <Button type="submit">Save</Button>
    </form>
  );
}
