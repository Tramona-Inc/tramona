import { Separator } from "../ui/separator";
import { formatCurrency, getNumNights } from "@/utils/utils";
import { plural } from "@/utils/utils";
import type { PropertyPageData } from "@/components/propertyPages/PropertyPage";
import React from "react";
import {
  breakdownPayment,
  getServiceFee,
} from "@/utils/payment-utils/paymentBreakdown";
import { RequestToBookPricing } from "../checkout/RequestToBookCheckout";

export function RequestToBookPriceDetails({
  property,
  bookOnAirbnb,
  requestToBookPricing,
}: {
  property: PropertyPageData;
  bookOnAirbnb?: boolean;
  requestToBookPricing: RequestToBookPricing;
}) {
  const numberOfNights = getNumNights(
    requestToBookPricing.checkIn,
    requestToBookPricing.checkOut,
  );
  const nightlyPrice =
    requestToBookPricing.travelerOfferedPriceBeforeFees / numberOfNights;

  const paymentBreakdown = breakdownPayment({
    scrapeUrl: property.originalListingPlatform ?? null,
    travelerOfferedPriceBeforeFees:
      requestToBookPricing.travelerOfferedPriceBeforeFees,
    datePriceFromAirbnb: requestToBookPricing.datePriceFromAirbnb,
    checkIn: requestToBookPricing.checkIn,
    checkOut: requestToBookPricing.checkOut,
    property,
  });

  const items = [
    {
      title: `${formatCurrency(nightlyPrice)} x ${plural(numberOfNights, "night")}`,
      price: `${formatCurrency(requestToBookPricing.travelerOfferedPriceBeforeFees)}`,
    },
    {
      title: "Cleaning fee",
      price: "Included",
    },
    {
      title: "Tramona service fee",
      price: `${formatCurrency(getServiceFee({ tripCheckout: paymentBreakdown }))}`,
    },
    {
      title: "Taxes",
      price: `${paymentBreakdown.taxesPaid === 0 ? "included" : formatCurrency(paymentBreakdown.taxesPaid)}`,
    },
  ];

  return (
    <>
      <div className="hidden space-y-4 md:block">
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
        <div className="flex items-center justify-between pb-4 font-bold">
          <p>Total (USD)</p>
          <p>{formatCurrency(paymentBreakdown.totalTripAmount)}</p>
        </div>
      </div>
      <div className="md:hidden">
        <p className="text-base font-bold">
          {formatCurrency(paymentBreakdown.totalTripAmount)}
        </p>
        <p className="text-muted-foreground"> Total after taxes</p>
      </div>
    </>
  );
}
