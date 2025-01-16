import SettingsLayout from "@/components/_common/Layout/SettingsLayout";
import AddPaymentInfoForm from "@/components/settings/AddPaymentInfoForm";
import { api } from "@/utils/api";
import { useStripe } from "@/utils/stripe-client";
import { Elements } from "@stripe/react-stripe-js";
import { type StripeElementsOptions } from "@stripe/stripe-js";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
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
      <div className="mx-auto min-h-screen max-w-4xl space-y-5 lg:min-h-screen-minus-header-n-footer xl:my-8">
        <div className="space-y-4 rounded-lg border bg-white p-4">
          <Link href="/settings" className="inline-block sm:hidden">
            <ChevronLeft />
          </Link>
          <h2 className="text-lg font-bold">Payment Method</h2>

          <Elements stripe={stripePromise} options={options}>
            <AddPaymentInfoForm />
          </Elements>
        </div>

        <div className="space-y-4 rounded-lg border bg-white p-4">
          <h2 className="text-lg font-bold">Saved Cards</h2>

          {payments && payments.cards.data.length > 0 ? (
            <div className="space-y-5">
              {payments.cards.data.map((payment) => (
                <Card key={payment.id} payment={payment} />
              ))}
            </div>
          ) : (
            <div className="py-4 text-muted-foreground">No saved cards yet</div>
          )}
        </div>
      </div>
    </SettingsLayout>
  );
}
