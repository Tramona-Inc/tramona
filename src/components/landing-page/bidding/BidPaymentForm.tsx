import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { StripeError } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

type Bid = {
  propertyId: number;
  numGuests: number;
  amount: number;
  checkIn: Date;
  checkOut: Date;
};

export default function BidPaymentForm({
  bid,
  setStep,
}: {
  bid: Bid;
  setStep: (step: number) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState<String | undefined>();
  const [loading, setLoading] = useState(false);

  const { update } = useSession();

  const { mutateAsync: confirmSetupIntentMutation } =
    api.stripe.confirmSetupIntent.useMutation();

  const { mutateAsync: createSetupIntentMutation } =
    api.stripe.createSetupIntent.useMutation();

  const { mutateAsync: createBiddingMutate } = api.biddings.create.useMutation({
    onSuccess: () => {
      console.log("hit");
      setStep(2);
    },
  });

  const handleError = (error: StripeError) => {
    setLoading(false);
    setErrorMessage(error.message);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setLoading(true);

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      handleError(submitError);
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

    // If payment method is successfully created, proceed with setup intent confirmation.
    const setupIntent = await createSetupIntentMutation({
      paymentMethod: paymentMethod.id,
    });

    if (setupIntent) {
      await confirmSetupIntentMutation({
        setupIntent: setupIntent.id,
      });
    }

    await update();

    // Create bidding after confirming setup intent.
    void createBiddingMutate({
      ...bid,
      setupIntentId: setupIntent?.id,
      paymentMethodId: paymentMethod.id,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <AddressElement options={{ mode: "billing" }} />
      <PaymentElement />
      <Button type="submit" disabled={!stripe || loading}>
        Save
      </Button>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </form>
  );
}
