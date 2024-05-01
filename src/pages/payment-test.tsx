import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { api } from "@/utils/api";
import { useStripe } from "@/utils/stripe-client";
import { Elements, PaymentElement, useElements } from "@stripe/react-stripe-js";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function PaymentTest() {
  const [options, setOptions] = useState<string>("");
  const [setupIntent, setSetupIntent] = useState<string>("");

  const { data: session } = useSession({ required: true });
  const stripePromise = useStripe();
  const elements = useElements(); // Move this line inside the component function

  const { mutateAsync: createSetupIntentSessionMutation } =
    api.stripe.createSetupIntentSession.useMutation();

  const { mutateAsync: confirmPaymentIntentMutation } =
    api.stripe.confirmPaymentIntentSetup.useMutation();

  async function checkout() {
    if (!session?.user) return;

    // Creates Session for mode setup and creates customer
    const response = await createSetupIntentSessionMutation();

    console.log(response?.client_secret);

    if (response?.client_secret && response.id) {
      setOptions(response.client_secret);
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
            <Elements stripe={stripePromise} options={{ clientSecret: options }}>
              <PaymentElement />
              <Button onClick={save}>Save</Button>
            </Elements>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
