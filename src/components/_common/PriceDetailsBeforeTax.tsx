import { Separator } from "../ui/separator";
import { formatCurrency, getNumNights } from "@/utils/utils";
import { plural } from "@/utils/utils";
import type { OfferWithDetails } from "@/components/offers/PropertyPage";
import React from "react";
import {
  breakdownPayment,
  getServiceFee,
} from "@/utils/payment-utils/paymentBreakdown";

export default function PriceDetailsBeforeTax({
  bookOnAirbnb, /// do we need this?
  offer,
}: {
  offer: OfferWithDetails;
  bookOnAirbnb?: boolean;
}) {
  const numberOfNights = getNumNights(offer.checkIn, offer.checkOut);
  const nightlyPrice = offer.travelerOfferedPriceBeforeFees / numberOfNights;
  const paymentBreakdown = breakdownPayment(offer);

  const items = [
    {
      title: `${formatCurrency(nightlyPrice)} x ${plural(numberOfNights, "night")}`,
      price: `${formatCurrency(offer.travelerOfferedPriceBeforeFees / numberOfNights)}`,
    },
    {
      title: "Cleaning fee",
      price: "Included",
    },
    {
      title: "Tramona service fee",
      price: `${formatCurrency(getServiceFee({ tripCheckout: paymentBreakdown }))}`, // no tax here
    },
  ];

  return (
    <>
      <div className="hidden space-y-3 md:block">
        {items.map((item, index) => (
          <div
            className="flex items-center justify-between text-sm font-semibold"
            key={index}
          >
            <p className="underline">{item.title}</p>
            <p>{item.price}</p>
          </div>
        ))}
        <Separator />
        <div className="flex flex-col gap-y-1">
          <div className="flex items-center justify-between font-bold">
            <p>Total (USD)</p>
            <p>
              {formatCurrency(
                paymentBreakdown.totalTripAmount - paymentBreakdown.taxesPaid,
              )}
            </p>
          </div>
          {!offer.scrapeUrl && (
            <p className="text-sm text-muted-foreground"> Total before taxes</p>
          )}
        </div>
      </div>
      <div className="md:hidden">
        <p className="text-base font-bold">
          {formatCurrency(
            paymentBreakdown.totalTripAmount - paymentBreakdown.taxesPaid,
          )}
        </p>
        <p className="text-muted-foreground"> Total before taxes</p>
      </div>
    </>
  );
}
