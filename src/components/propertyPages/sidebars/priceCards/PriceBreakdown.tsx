import React from "react";
import type { RequestToBookDetails } from "./RequestToBookOrBookNowPriceCard";
import {
  breakdownPaymentByOffer,
  breakdownPaymentByPropertyAndTripParams,
} from "@/utils/payment-utils/paymentBreakdown";
import type { PropertyPageData } from "../RequestToBookSideBar";
import { formatCurrency } from "@/utils/utils";
import type { OfferWithDetails } from "@/components/propertyPages/PropertyPage";

function PriceBreakdown(
  props:
    | {
        requestToBookDetails: RequestToBookDetails;
        property: PropertyPageData;
        requestAmount: number; // Required in this case
        offer?: never; // Explicitly disallow `offer` if these props are provided
      }
    | {
        offer: OfferWithDetails; // Required in this case
        requestToBookDetails?: never; // Explicitly disallow these props if `offer` is provided
        property?: never;
        requestAmount?: never;
      },
) {
  let brokedownPrice;
  if (props.offer) {
    brokedownPrice = breakdownPaymentByOffer(props.offer);
  } else {
    brokedownPrice = breakdownPaymentByPropertyAndTripParams({
      dates: {
        checkIn: props.requestToBookDetails.checkIn,
        checkOut: props.requestToBookDetails.checkOut,
      },
      property: props.property,
      travelerPriceBeforeFees: props.requestAmount,
    });
  }
  console.log("brokedownPrice", brokedownPrice);
  if (!brokedownPrice) return <div>Loading ...</div>;

  const serviceFee =
    brokedownPrice.superhogFee + brokedownPrice.stripeTransactionFee;

  return (
    <div className="my-2 flex w-full flex-col gap-y-1 text-sm text-muted-foreground">
      <div className="flex items-center justify-between">
        <span>Trip Subtotal</span>
        <span className="font-semibold">
          {formatCurrency(
            brokedownPrice.totalTripAmount -
              (brokedownPrice.taxesPaid + serviceFee),
          )}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span>Taxes</span>
        <span>{formatCurrency(brokedownPrice.taxesPaid)}</span>
      </div>
      <div className="flex items-center justify-between">
        <span>Service Fee</span>
        <span>{formatCurrency(serviceFee)}</span>
      </div>
      {brokedownPrice.totalSavings > 0 && (
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

export default PriceBreakdown;
