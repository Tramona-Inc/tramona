import SettingsLayout from "@/components/_common/Layout/SettingsLayout";
import AddPaymentInfoForm from "@/components/settings/AddPaymentInfoForm";
import { api } from "@/utils/api";
import { useStripe } from "@/utils/stripe-client";
import { Elements } from "@stripe/react-stripe-js";
import { type StripeElementsOptions } from "@stripe/stripe-js";
import type Stripe from "stripe";

function Card({ payment }: { payment: Stripe.PaymentMethod }) {
  return (
    <div key={payment.id} className="flex justify-between">
      **** **** **** {payment.card?.last4}{" "}
      <span className="capitalize">{payment.card?.brand}</span>{" "}
      {payment.card?.exp_month}/{payment.card?.exp_year}
    </div>
  );
}

export default function PaymentInformation() {
  const options: StripeElementsOptions = {
    mode: "setup",
    currency: "usd",
    paymentMethodCreation: "manual",
  };

  const stripePromise = useStripe();

  const { data: payments } = api.stripe.getListOfPayments.useQuery();

  return (
    <SettingsLayout>
      <div className="mx-auto my-8 max-w-4xl space-y-5">
        <div className="space-y-4 rounded-lg border bg-white p-4">
          <h1 className="text-lg font-bold">Payment Method</h1>

          <Elements stripe={stripePromise} options={options}>
            <AddPaymentInfoForm />
          </Elements>
        </div>

        <div className="space-y-4 rounded-lg border bg-white p-4">
          <h1 className="text-lg font-bold">Saved Cards</h1>

          {payments && payments.cards.data.length > 0 && (
            <div className="space-y-5">
              {payments.cards.data.map((payment) => (
                <Card key={payment.id} payment={payment} />
              ))}
            </div>
          )}
        </div>
      </div>
    </SettingsLayout>
  );
}
