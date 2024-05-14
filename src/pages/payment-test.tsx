import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useStripe } from "@/utils/stripe-client";
import { Elements } from "@stripe/react-stripe-js";
import { type StripeElementsOptions } from "@stripe/stripe-js";
import PaymentTestForm from "./payment-test-form";

export default function PaymentTest() {
  const options: StripeElementsOptions = {
    mode: "setup",
    currency: "usd",
    paymentMethodCreation: "manual",
  };

  const stripePromise = useStripe();

  return (
    <>
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <div className="flex h-screen flex-col items-center justify-center">
            <Elements stripe={stripePromise} options={options}>
              <PaymentTestForm />
            </Elements>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
