import { Separator } from "../ui/separator";
import {
  formatCurrency,
  getNumNights,
  getTramonaPriceBreakdown,
  getDirectListingPriceBreakdown,
} from "@/utils/utils";
import { plural } from "@/utils/utils";
import { TAX_PERCENTAGE, SUPERHOG_FEE } from "@/utils/constants";
import type { OfferWithDetails } from "@/components/offers/PropertyPage";

export function OfferPriceDetails({
  offer,
  bookOnAirbnb,
}: {
  offer: OfferWithDetails;
  bookOnAirbnb?: boolean;
}) {
  const numberOfNights = getNumNights(offer.checkIn, offer.checkOut);
  const nightlyPrice = offer.travelerOfferedPrice / numberOfNights;
  const { bookingCost, taxPaid, serviceFee, finalTotal } = offer.scrapeUrl
    ? getDirectListingPriceBreakdown({
        bookingCost: offer.travelerOfferedPrice,
      })
    : getTramonaPriceBreakdown({
        bookingCost: offer.travelerOfferedPrice,
        numNights: numberOfNights,
        superhogFee: SUPERHOG_FEE,
        tax: TAX_PERCENTAGE,
      });
  const items = [
    {
      title: `${formatCurrency(nightlyPrice)} x ${plural(numberOfNights, "night")}`,
      price: `${formatCurrency(bookingCost)}`,
    },
    {
      title: "Cleaning fee",
      price: "Included",
    },
    {
      title: "Tramona service fee",
      price: `${formatCurrency(serviceFee)}`,
    },
    {
      title: "Taxes",
      price: `${taxPaid === 0 ? "included" : formatCurrency(taxPaid)}`,
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
          <p>{formatCurrency(finalTotal)}</p>
        </div>
      </div>
      <div className="md:hidden">
        <p className="text-base font-bold">{formatCurrency(finalTotal)}</p>
        <p className="text-muted-foreground"> Total after taxes</p>
      </div>
    </>
  );
}
