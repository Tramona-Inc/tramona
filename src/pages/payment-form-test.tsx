import { Button } from "@/components/ui/button";
import { useStripe } from '@/utils/stripe-client';
import { PaymentElement, useElements } from "@stripe/react-stripe-js";

export default function PaymentTestForm() {
  const stripePromise = useStripe();
  const elements = useElements(); // Move this line inside the component function


  async function save() {
    const stripe = await stripePromise;

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(PaymentElement);
    if (!cardElement) return;

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      console.error("Error creating payment method:", error.message);
      // Handle error
      return;
    }

    if (!paymentMethod) {
      console.error("No payment method created");
      // Handle no payment method created
      return;
    }

    const { error: confirmError } = await stripe.confirmPaymentIntent(options, {
      payment_method: paymentMethod.id,
    });

    if (confirmError) {
      console.error("Error confirming payment intent:", confirmError.message);
      // Handle error confirming payment intent
      return;
    }

    void confirmPaymentIntentMutation({
      setupIntent: setupIntent,
    });
  }


  return (
    <div>
      <PaymentElement />
      <Button onClick={save}>Save</Button>
    </div>
  );
}
