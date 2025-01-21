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
  let numOfNights;
  if (props.offer) {
    brokedownPrice = breakdownPaymentByOffer(
      props.offer,
      props.offer.request!.numGuests,
    );
    numOfNights = getNumNights(props.offer.checkIn, props.offer.checkOut);
  } else {
    brokedownPrice = breakdownPaymentByPropertyAndTripParams({
      dates: {
        checkIn: props.requestToBookDetails.checkIn,
        checkOut: props.requestToBookDetails.checkOut,
      },
      property: props.property,
      travelerPriceBeforeFees: props.requestAmount, //NOT PER NIGHT
      numOfGuests: props.requestToBookDetails.numGuests,
    });
    numOfNights = getNumNights(
      props.requestToBookDetails.checkIn,
      props.requestToBookDetails.checkOut,
    );
  }

  console.log("totaltripamount", brokedownPrice.totalTripAmount);
  console.log("taxes paid", brokedownPrice.taxesPaid);
  return (
    <div className="my-4 flex w-full flex-col gap-y-1 text-sm">
      <div className="flex items-center justify-between">
        <span className="underline underline-offset-2">
          {numOfNights} night{numOfNights > 1 ? "s" : ""}
        </span>
        <span className="font-semibold">
          {formatCurrency(
            brokedownPrice.totalTripAmount - brokedownPrice.taxesPaid,
          )}
        </span>
      </div>

      {brokedownPrice.totalSavings > 0 && (
        <div className="flex items-center justify-between text-green-600">
          <span>Savings</span>
          <span>-{formatCurrency(brokedownPrice.totalSavings)}</span>
        </div>
      )}
      <div className="my-2 border-t pt-2">
        <div className="flex items-center justify-between text-lg font-bold tracking-tight text-black">
          <span>Total before taxes</span>
          <span>
            {formatCurrency(
              brokedownPrice.totalTripAmount - brokedownPrice.taxesPaid,
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

export default PriceBreakdown;
