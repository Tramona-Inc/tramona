import { Button } from "@/components/ui/button";
import { api } from '@/utils/api';
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

export default function PaymentFormTest({
  options,
  setupIntent,
}: {
  options: string;
  setupIntent: string;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const { mutateAsync: confirmPaymentIntentMutation } =
    api.stripe.confirmPaymentIntentSetup.useMutation();

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (stripe === null || elements === null) {
      return;
    }

    const { error: submitError } = await elements.submit();
    if (submitError) {
      return;
    }

    const { error } = await stripe.confirmSetup({
      elements,
      clientSecret: options,
      confirmParams: {
        return_url: `${window.location.origin}/payment-test`,
      },
      // Uncomment below if you only want redirect for redirect-based payments
      redirect: "if_required",
    });



    if (!error) {
      void confirmPaymentIntentMutation({ setupIntent });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button type={"submit"}>Save</Button>
    </form>
  );
}
