import React from "react";
import type { RequestToBookDetails } from "./RequestToBookOrBookNowPriceCard";
import {
  breakdownPaymentByOffer,
  breakdownPaymentByPropertyAndTripParams,
} from "@/utils/payment-utils/paymentBreakdown";
import type { PropertyPageData } from "../RequestToBookSideBar";
import { formatCurrency } from "@/utils/utils";
import type { OfferWithDetails } from "@/components/propertyPages/PropertyPage";
import { getNumNights } from "@/utils/utils";
import { PriceBreakdownOutput } from "@/components/checkout/types";

function PriceBreakdownForTravelers(
  props:
    | {
        propertyPricing: PriceBreakdownOutput;
        numNights?: number;
        property?: PropertyPageData;
        requestAmount?: number; // Required in this case
        offer?: never; // Explicitly disallow `offer` if these props are provided
      }
    | {
        offer: OfferWithDetails; // Required in this case
        propertyPricing?: never; // Explicitly disallow these props if `offer` is provided
        property?: never;
        requestAmount?: never;
      },
) {
  let brokedownPrice: PriceBreakdownOutput;
  let numOfNights;
  console.log(props.requestAmount);

  if (props.offer) {
    brokedownPrice = breakdownPaymentByOffer(props.offer);
    numOfNights = getNumNights(props.offer.checkIn, props.offer.checkOut);
  } else {
    brokedownPrice = props.propertyPricing;
    numOfNights = props.numNights;
  }

  const serviceFee =
    brokedownPrice.superhogFee + brokedownPrice.stripeTransactionFee;

  console.log(props.propertyPricing);
  return (
    <div className="my-2 flex w-full flex-col gap-y-1 text-sm text-muted-foreground">
      <div className="flex items-center justify-between font-semibold">
        <span>
          Trip Subtotal{" "}
          <span className="text-xs font-light">{numOfNights}x nights</span>
        </span>
        <span className="font-semibold">
          {formatCurrency(
            brokedownPrice.totalTripAmount - brokedownPrice.taxesPaid,
          )}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span>Taxes</span>
        <span>{formatCurrency(brokedownPrice.taxesPaid)}</span>
      </div>
      {props.property?.originalListingPlatform !== "Casamundo" &&
        brokedownPrice.totalSavings > 0 && (
          <div className="flex items-center justify-between text-green-600">
            <span>Savings</span>
            <span>-{formatCurrency(brokedownPrice.totalSavings)}</span>
          </div>
        )}
      <div className="my-2 border-t pt-2">
        <div className="flex items-center justify-between text-lg font-semibold text-black">
          <span>Total</span>
          <span>{formatCurrency(brokedownPrice.totalTripAmount)}</span>
        </div>
      </div>
    </div>
  );
}

export default PriceBreakdownForTravelers;
