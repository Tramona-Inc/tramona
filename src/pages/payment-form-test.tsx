import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { useBidding } from "@/utils/store/bidding";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

export default function PaymentFormTest({
  clientSecret,
  setupIntent,
  bid,
}: {
  clientSecret: string;
  setupIntent: string;
  bid: {
    propertyId: number;
    numGuests: number;
    amount: number;
    checkIn: Date;
    checkOut: Date;
  };
}) {
  const stripe = useStripe();
  const elements = useElements();

  const step = useBidding((state) => state.step);
  const setStep = useBidding((state) => state.setStep);

  const { mutateAsync: confirmPaymentIntentMutation } =
    api.stripe.confirmPaymentIntentSetup.useMutation();

  const { mutate: createBiddingMutate } = api.biddings.create.useMutation({
    onSuccess: () => {
      // resetSession();
      setStep(step + 1);
    },
  });

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
      clientSecret: clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/payment-test`,
      },
      // Uncomment below if you only want redirect for redirect-based payments
      redirect: "if_required",
    });

    if (!error) {
      void confirmPaymentIntentMutation({ setupIntent });
      void createBiddingMutate({ ...bid });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button type={"submit"}>Save</Button>
    </form>
  );
}
