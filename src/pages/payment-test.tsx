import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { api } from "@/utils/api";
import { useStripe } from '@/utils/stripe-client';
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { useSession } from "next-auth/react";
import { useState } from "react";
import type Stripe from "stripe";

export default function PaymentTest() {
  const [options, setOptions] =
    useState<Stripe.Response<Stripe.Checkout.Session>>();

  const { mutateAsync: createSetupIntentSessionMutation } =
    api.stripe.createSetupIntentSession.useMutation();

  const { mutateAsync: getStripeSessionMutate } =
    api.stripe.getStripeSession.useMutation();

  const { data: listOfPayments } =
    api.stripe.getListOfPayments.useQuery();

  console.log(listOfPayments)

  // const { mutateAsync: getSetupIntentMutate } =
  //   api.stripe.getSetUpIntent.useMutation();

  const data = {
    listingId: 123,
    propertyId: 456,
    requestId: 789,
    name: "string",
    price: 100,
    description: "",
    cancelUrl: "/payment-test", // Rename cancel_url to cancelUrl
    totalSavings: 20,
    phoneNumber: "123-456-7890",
  };

  const session = useSession({ required: true });

  const stripePromise = useStripe();

  async function checkout() {
    const stripe = await stripePromise;

    if (!session.data?.user) return;

    // Creates Session for mode setup and creates customer
    const response = await createSetupIntentSessionMutation(data);

    console.log(response);

    if (stripe !== null && response) {
      const sesh = await getStripeSessionMutate({
        sessionId: response.id,
      });

      if (sesh.metadata.setupIntent) {
        // ! Only get setup intent for host/admin to accept offer
        // const intent = await getSetupIntentMutate({
        //   setupIntent: sesh.metadata.setupIntent as string,
        // });

        // console.log(intent);
        // Creates and redirects user to URL
        // await stripe.redirectToCheckout({
        //   sessionId: response.id,
        // });

        setOptions(response);
      }
    }
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button onClick={checkout}>Set up</Button>
        </DialogTrigger>
        <DialogContent>
          {options && (
            <EmbeddedCheckoutProvider stripe={stripePromise} options={{clientSecret: options.client_secret ?? ''}}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
