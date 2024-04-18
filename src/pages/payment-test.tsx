import { useStripe } from "@/components/requests/[id]/OfferCard/HowToBookDialog";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";

export default function PaymentTest() {
  const { mutateAsync: createSetupSessionMutation } =
    api.stripe.createSetupSession.useMutation();

  const { mutateAsync: getStripeSessionMutate } =
    api.stripe.getStripeSession.useMutation();

  const { mutateAsync: getSetupIntentMutate } =
    api.stripe.getSetUpIntent.useMutation();

  const data = {
    listingId: 123,
    propertyId: 456,
    requestId: 789,
    price: 100,
    totalSavings: 20,
    phoneNumber: "123-456-7890",
    cancelUrl: "/payment-test", // Rename cancel_url to cancelUrl
  };

  const session = useSession({ required: true });

  const stripePromise = useStripe();

  async function checkout() {
    const stripe = await stripePromise;

    if (!session.data?.user) return;

    // Creates Session for mode setup and creates customer
    const response = await createSetupSessionMutation(data);

    if (stripe !== null && response) {
      const sesh = await getStripeSessionMutate({
        sessionId: response.id,
      });

      if (sesh.metadata.setupIntent) {
        const intent = await getSetupIntentMutate({
          setupIntent: sesh.metadata.setupIntent as string,
        });

        // console.log(intent);
        // Creates and redirects user to URL
        await stripe.redirectToCheckout({
          sessionId: response.id,
        });
      }
    }
  }

  return (
    <div>
      <Button onClick={checkout}>Set up</Button>
    </div>
  );
}
