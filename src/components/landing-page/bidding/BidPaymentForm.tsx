import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { useBidding } from "@/utils/store/bidding";
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

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

  // const { data: payments } = api.stripe.getListOfPayments.useQuery();

  const { mutateAsync: createPaymentIntentMutation } =
    api.stripe.createPaymentIntent.useMutation();

  const { mutateAsync: confirmPaymentIntentMutation } =
    api.stripe.confirmPaymentIntentSetup.useMutation();

  const { mutate: createBiddingMutate } = api.biddings.create.useMutation({
    onSuccess: () => {
      setStep(step + 1);
    },
  });

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (stripe === null || elements === null) {
      return;
    }

    const { error: submitError } = await elements.submit();
    if (submitError) {
      return;
    }

    const { error } = await createPaymentIntentMutation({
      amount: bid.amount * 100,
      currency: "usd",
    });

    if (!error) {
      void confirmPaymentIntentMutation({ setupIntent });
      void createBiddingMutate({ ...bid });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* {payments && payments.cards.data.length > 0 ? (
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
      )} */}
      <AddressElement options={{ mode: "billing" }} />
      <PaymentElement />
      <Button type={"submit"}>Save</Button>
    </form>
  );
}
