import { Separator } from "../ui/separator";
import { formatCurrency, getNumNights } from "@/utils/utils";
import { plural } from "@/utils/utils";
import type { PropertyPageData, RequestToBookDetails } from "@/components/offers/PropertyPage";
import React from "react";
import { getServiceFee } from "@/utils/payment-utils/paymentBreakdown";

export function RequestToBookPriceDetails({
  property,
  requestToBook,
  bookOnAirbnb,
}: {
  property: PropertyPageData;
  requestToBook: RequestToBookDetails;
  bookOnAirbnb?: boolean;
}) {
  const numberOfNights = getNumNights(requestToBook.checkIn, requestToBook.checkOut);
//   const nightlyPrice = offer.travelerOfferedPriceBeforeFees / numberOfNights;
const nightlyPrice = 31500 / numberOfNights;
  // const { bookingCost, taxPaid, serviceFee, finalTotal } = offer.scrapeUrl
  //   ? getDirectListingPriceBreakdown({
  //       bookingCost: offer.travelerOfferedPriceBeforeFees,
  //     })
  //   : getTramonaPriceBreakdown({
  //       bookingCost: offer.travelerOfferedPriceBeforeFees,
  //       numNights: numberOfNights,
  //       superhogFee: SUPERHOG_FEE,
  //       tax: TAX_PERCENTAGE,
  //     });
  const items = [
    {
      title: `${formatCurrency(nightlyPrice)} x ${plural(numberOfNights, "night")}`,
    //   price: `${formatCurrency(offer.tripCheckout.travelerOfferedPriceBeforeFees / numberOfNights)}`,
      price: `${formatCurrency(31500 / numberOfNights)}`,
    },
    {
      title: "Cleaning fee",
      price: "Included",
    },
    {
      title: "Tramona service fee",
    //   price: `${formatCurrency(getServiceFee({ tripCheckout: offer.tripCheckout }))}`,
      price: `${formatCurrency(300 + 500 )}`,
    },
    {
      title: "Taxes",
    //   price: `${offer.tripCheckout.taxesPaid === 0 ? "included" : formatCurrency(offer.tripCheckout.taxesPaid)}`,
      price: `${"included"}`,
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
          {/* <p>{formatCurrency(offer.tripCheckout.totalTripAmount)}</p> */}
          <p>{formatCurrency(35700)}</p>
        </div>
      </div>
      <div className="md:hidden">
        <p className="text-base font-bold">
          {/* {formatCurrency(offer.tripCheckout.totalTripAmount)} */}
          {formatCurrency(78213)}

        </p>
        <p className="text-muted-foreground"> Total after taxes</p>
      </div>
    </>
  );
}
