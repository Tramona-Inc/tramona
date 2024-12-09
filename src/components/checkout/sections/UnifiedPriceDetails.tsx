import { Separator } from "../../ui/separator";
import { formatCurrency, getNumNights } from "@/utils/utils";
import { plural } from "@/utils/utils";
import React from "react";
import {
  breakdownPaymentByPropertyAndTripParams,
  getServiceFee,
} from "@/utils/payment-utils/paymentBreakdown";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import type { UnifiedCheckoutData } from "../types";

export function UnifiedPriceDetails({
  unifiedCheckoutData,
}: {
  unifiedCheckoutData: UnifiedCheckoutData;
}) {
  const numberOfNights = getNumNights(
    unifiedCheckoutData.dates.checkIn,
    unifiedCheckoutData.dates.checkOut,
  );
  const nightlyPrice =
    unifiedCheckoutData.pricing.travelerOfferedPriceBeforeFees / numberOfNights;

  const paymentBreakdown = breakdownPaymentByPropertyAndTripParams({
    dates: {
      checkIn: unifiedCheckoutData.dates.checkIn,
      checkOut: unifiedCheckoutData.dates.checkOut,
    },
    travelerPriceBeforeFees:
      unifiedCheckoutData.pricing.travelerOfferedPriceBeforeFees,
    property: unifiedCheckoutData.property,
  });

  const items = [
    {
      title: `${formatCurrency(nightlyPrice)} x ${plural(numberOfNights, "night")}`,
      price: `${formatCurrency(unifiedCheckoutData.pricing.travelerOfferedPriceBeforeFees / numberOfNights)}`,
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
        {unifiedCheckoutData.property.currentSecurityDeposit > 0 && (
          <div className="flex items-center justify-between text-sm font-light">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="flex flex-col">
                  <div className="flex flex-row items-center gap-x-1 font-semibold">
                    Security deposit <InfoIcon size={13} />
                  </div>
                  <p className="text-xs tracking-tight">
                    Temporary hold, not collected upfront.
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-lg">
                    No immediate charge: The security deposit is an
                    authorization hold facilitated by Tramona, not an actual
                    charge to your card. We act as the intermediary to ensure
                    fairness and security. Unless the host files a claim for
                    damages or extra charges after your stay, Tramona will
                    release the hold back to you automatically.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <p>
              {formatCurrency(
                unifiedCheckoutData.property.currentSecurityDeposit,
              )}
            </p>
          </div>
        )}
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
