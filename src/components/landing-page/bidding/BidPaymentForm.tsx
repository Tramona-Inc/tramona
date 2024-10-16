import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/utils/api";
import { useBidding } from "@/utils/store/bidding";
import { cn } from "@/utils/utils";
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { type StripeError } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

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

  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const { update } = useSession();

  const { mutateAsync: confirmSetupIntentMutation } =
    api.stripe.confirmSetupIntent.useMutation();

  const { mutateAsync: createSetupIntentMutation } =
    api.stripe.createSetupIntent.useMutation();

  const { mutateAsync: createBiddingMutate } = api.biddings.create.useMutation({
    onSuccess: () => {
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

  const { data: session } = useSession();

  const [isStripeLoading, setIsStripeLoading] = useState(true);

  useEffect(() => {
    if (elements) {
      const element = elements.getElement("payment");
      element?.on("ready", () => {
        setIsStripeLoading(false);
      });
    }
  }, [elements]);

  const router = useRouter();

  const setDisplayUserBid = useBidding((state) => state.setDisplayUserBid);

  return (
    <div className="relative flex min-h-[600px] items-center justify-center">
      {!session?.user && (
        <div className="absolute bottom-52 z-10 flex flex-col gap-5 rounded-lg border bg-white p-5">
          <DialogHeader>
            <DialogTitle>Please Log in</DialogTitle>
            <DialogDescription>
              In order to make a bid, please log in or sign up.
            </DialogDescription>
          </DialogHeader>
          <Button
            variant={"secondary"}
            className="w-full"
            onClick={() => {
              setDisplayUserBid(true);

              void router.push({
                pathname: "/auth/signin",
                query: { from: `/property/${bid.propertyId}` },
              });
            }}
          >
            Log in
          </Button>
          <Button asChild className="w-full">
            <Link href={"/auth/signup"}>Sign Up</Link>
          </Button>
        </div>
      )}
      <div className={cn(!session?.user.id && "blur-sm filter")}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <AddressElement options={{ mode: "billing" }} />
          <PaymentElement />
          <Button type="submit" disabled={!stripe || loading}>
            Save
          </Button>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </form>
      </div>
    </div>
  );
}
