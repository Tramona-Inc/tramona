import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { useBidding } from "@/utils/store/bidding";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";

export default function BidPaymentForm({
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

  const { update } = useSession();

  const stripe = useStripe();
  const elements = useElements();

  const step = useBidding((state) => state.step);
  const setStep = useBidding((state) => state.setStep);

  const { mutateAsync: confirmPaymentIntentMutation } =
    api.stripe.confirmPaymentIntentSetup.useMutation();

  const { mutate: createBiddingMutate } = api.biddings.create.useMutation({
    onSuccess: () => {
      void update(); //update session
      // resetSession();
      setStep(step + 1);
    },
  });

  const { data: payments } = api.stripe.getListOfPayments.useQuery();


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
      {payments && payments.cards.data.length > 0 ? (
        <Select
          defaultValue={(payments.defaultPaymentMethod as string) ?? undefined}
        >
          <SelectTrigger className="">
            <SelectValue placeholder="Credit Cards" />
          </SelectTrigger>
          <SelectContent>
            {payments.cards.data.map((payment) => (
              <SelectItem key={payment.id} value={payment.id}>
                **** **** **** {payment.card?.last4}{" "}
                <span className="capitalize">{payment.card?.brand}</span>{" "}
                {payment.card?.exp_month}/{payment.card?.exp_year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <PaymentElement />
      )}
      <Button type={"submit"}>Save</Button>
    </form>
  );
}
