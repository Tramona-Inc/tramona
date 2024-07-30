import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
  AddressElement,
  LinkAuthenticationElement,
  ExpressCheckoutElement,
} from "@stripe/react-stripe-js";
import { Separator } from "../ui/separator";
import { useStripe as useCustomStripe } from "@/utils/stripe-client";
import ContactInfoForm from "./ContactInfoForm";
import type {
  StripePaymentElementOptions,
  StripeExpressCheckoutElementOptions,
} from "@stripe/stripe-js";
import { env } from "@/env";

export default function StripeCheckoutForm({
  clientSecret,
}: {
  clientSecret: string;
}) {
  const isProduction = process.env.NODE_ENV === "production";
  const paymentOptions: StripePaymentElementOptions = {
    business: { name: "Tramona" },
    layout: {
      type: "tabs",
    },
  };
  const stripe = useStripe();
  const customStripe = useCustomStripe(); //OUR STRIPE HOOK. CONFUSING I KNOW

  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    const { error } = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: isProduction
          ? "https://www.tramona.com"
          : "http://localhost:3000",
      },
    });

    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      setErrorMessage(error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  }
  const expressCheckoutOptions: StripeExpressCheckoutElementOptions = {
    buttonType: {
      applePay: "buy",
      googlePay: "buy",
    },
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col items-center gap-y-4"
      >
        <h2 className="self-start text-lg font-semibold">Payment</h2>
        <div className="flex flex-col items-center gap-x-2">
          <ExpressCheckoutElement
            options={expressCheckoutOptions}
            onConfirm={() => handleSubmit}
          />
          <div>
            <div className="my-2 flex flex-row items-center justify-center gap-x-2 text-nowrap text-sm text-muted-foreground">
              <div className="w-full border border-t border-zinc-200" />
              Or pay with card
              <div className="w-full border border-t border-zinc-200" />
            </div>
            <LinkAuthenticationElement />
            <div className="my-4 flex flex-row gap-x-6">
              <AddressElement
                options={{
                  mode: "billing",
                  autocomplete: {
                    mode: "google_maps_api",
                    apiKey: env.NEXT_PUBLIC_GOOGLE_PLACES_KEY,
                  },
                }}
              />
              <PaymentElement options={paymentOptions} />
            </div>
          </div>
        </div>
        <Separator className="my-2 w-full" />
        <ContactInfoForm />
        <TermsAndSubmit />
        <Button
          type="submit"
          variant="greenPrimary"
          className="w-full"
          disabled={!stripe}
        >
          Confirm and Book
        </Button>
      </form>
    </div>
  );
}

function TermsAndSubmit() {
  return (
    <div className="md:mt-8">
      <div className="mb-8 space-y-4 text-muted-foreground">
        <p className="text-sm font-semibold leading-5">
          On behalf of Tramona we ask that you please follow the house rules and
          treat the house as if it were your own
        </p>
        <p className="px-2 text-xs md:px-0">
          By selecting the button, I agree to the booking terms. I also agree to
          the Terms of Service, Payment Terms of Service and I acknowledge the
          Privacy Policy
        </p>
      </div>
      <p className="my-4 text-center text-xs font-semibold text-muted-foreground md:my-0">
        As soon as you book you will get an email and text confirmation with all
        booking details
      </p>
      <Separator className="my-4" />
    </div>
  );
}
