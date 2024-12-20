import React from "react";
import type { RequestToBookDetails } from "./RequestToBookOrBookNowPriceCard";
import { breakdownPaymentByPropertyAndTripParams } from "@/utils/payment-utils/paymentBreakdown";
import type { PropertyPageData } from "../RequestToBookSideBar";
import { formatCurrency } from "@/utils/utils";
function PriceBreakdown({
  requestToBookDetails,
  property,
  requestAmount,
}: {
  requestToBookDetails: RequestToBookDetails;
  property: PropertyPageData;
  requestAmount: number; //if book it now, it will be the full price
}) {
  const brokedownPrice = breakdownPaymentByPropertyAndTripParams({
    dates: {
      checkIn: requestToBookDetails.checkIn,
      checkOut: requestToBookDetails.checkOut,
    },
    property,
    travelerPriceBeforeFees: requestAmount,
  });
  console.log("brokedownPrice", brokedownPrice);
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
      </div>ke
      
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
