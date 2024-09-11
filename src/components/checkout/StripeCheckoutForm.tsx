import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
  AddressElement,
  ExpressCheckoutElement,
} from "@stripe/react-stripe-js";
import { Separator } from "../ui/separator";
import ContactInfoForm from "./ContactInfoForm";
import type {
  StripePaymentElementOptions,
  StripeExpressCheckoutElementOptions,
} from "@stripe/stripe-js";
import { env } from "@/env";
import { toast } from "@/components/ui/use-toast";
import { descripeStripeDeclineCode } from "@/utils/stripe-client";

export default function StripeCheckoutForm() {
  const isProduction = process.env.NODE_ENV === "production";
  const baseUrl = isProduction
    ? "https://www.tramona.com"
    : "http://localhost:3000"; //change to your live server
  const paymentOptions: StripePaymentElementOptions = {
    business: { name: "Tramona" },
    layout: {
      type: "tabs",
    },
  };
  const stripe = useStripe();

  const elements = useElements();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    if (!stripe || !elements) {
      return;
    }
    const { error } = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: `${baseUrl}/my-trips/confirmation`,
      },
    });

    if (error.decline_code) {
      const errorDescription = descripeStripeDeclineCode({
        declineCode: error.decline_code,
      });

      toast({
        title: "Payment Failed",
        description: errorDescription,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    }
    setLoading(false);
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
        className="flex w-full flex-col items-center gap-y-2"
      >
        <h2 className="self-start text-lg font-semibold">Payment</h2>
        <div className="mt-4 flex w-full flex-col items-center gap-y-4">
          <ExpressCheckoutElement
            options={expressCheckoutOptions}
            onConfirm={() => handleSubmit}
          />
          <div className="my-2 flex w-full flex-row items-center justify-center gap-x-2 text-nowrap text-sm text-muted-foreground">
            <div className="w-full border border-t border-zinc-200" />
            Or pay with card
            <div className="w-full border border-t border-zinc-200" />
          </div>
          <div className="my-4 flex w-full flex-col gap-y-6">
            <PaymentElement options={paymentOptions} />
            <AddressElement
              options={{
                mode: "billing",
                autocomplete: {
                  mode: "google_maps_api",
                  apiKey: env.NEXT_PUBLIC_GOOGLE_PLACES_KEY,
                },
              }}
            />
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
          {loading ? (
            <div className="flex h-full items-center justify-center space-x-2">
              <span className="text-white">Loading</span>
              <div className="h-1 w-1 animate-bounce rounded-full bg-white [animation-delay:-0.3s]"></div>
              <div className="h-1 w-1 animate-bounce rounded-full bg-white [animation-delay:-0.15s]"></div>
              <div className="h-1 w-1 animate-bounce rounded-full bg-white"></div>
            </div>
          ) : (
            "Confirm and Book"
          )}
        </Button>
      </form>
    </div>
  );
}

function TermsAndSubmit() {
  return (
    <div className="">
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
