import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { type StripeError } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function AddPaymentInfoForm() {
  const { update } = useSession();

  const stripe = useStripe();
  const elements = useElements();

  const [_, setErrorMessage] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const { mutateAsync: confirmSetupIntentMutation } =
    api.stripe.confirmSetupIntent.useMutation();

  const { mutateAsync: createSetupIntentMutation } =
    api.stripe.createSetupIntent.useMutation();

  const handleError = (error: StripeError) => {
    setLoading(false);
    setErrorMessage(error.message);
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
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

    // Clear form fields and error message
    elements.getElement("address")?.clear();
    elements.getElement("payment")?.clear();
    setErrorMessage(undefined);

    // Update session
    await update();

    // Reset loading state
    setLoading(false);

    // Clear form fields and error message
    elements.getElement("address")?.clear();
    elements.getElement("payment")?.clear();
  };

  return (
    <form onSubmit={handleSubmit}>
      <AddressElement options={{ mode: "billing" }} />
      <PaymentElement />
      <Button className={"mt-4"} type="submit" disabled={!stripe || loading}>
        Add Payment Method
      </Button>
    </form>
  );
}
