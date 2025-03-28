import { Property } from "@/server/db/schema";
import type { OfferWithDetails } from "@/components/propertyPages/PropertyPage";
import { CardContent, Card } from "@/components/ui/card";
import { InfoIcon, FlameIcon } from "lucide-react";
import { format } from "date-fns";
import {
  cn,
  formatCurrency,
  formatDateMonthDayYear,
  getNumNights,
  formatShortDate,
} from "@/utils/utils";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import PriceCardInformation from "./priceCards/PriceCardInformation";
import BookNowBtn from "./actionButtons/BookNowBtn";
import { useState } from "react";
import Link from "next/link";
import { TRAVELER_MARKUP } from "@/utils/constants";
import PriceBreakdownForTravelers from "./priceCards/PriceBreakdownForTravelers";
import { breakdownPaymentByOffer } from "@/utils/payment-utils/paymentBreakdown";

export default function OfferPageSidebar({
  offer,
  property,
}: {
  offer: OfferWithDetails;
  property: Pick<
    Property,
    | "stripeVerRequired"
    | "originalListingId"
    | "bookOnAirbnb"
    | "maxNumGuests"
    | "id"
    | "bookItNowEnabled"
    | "discountTiers"
  >;
}) {
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);
  const brokedownPrice = breakdownPaymentByOffer(offer);

  return (
    <div className="space-y-4">
      <Card className="w-full bg-gray-50 shadow-lg">
        <CardContent className="flex flex-col gap-y-2 rounded-xl md:p-2 xl:p-6">
          <div className="grid w-full grid-cols-2 overflow-hidden rounded-lg border text-left focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <div className="border-r p-3">
              <div className="text-sm text-muted-foreground">CHECK-IN</div>
              <div className="text-base font-medium">
                {formatShortDate(offer.checkIn)}
              </div>
            </div>
            <div className="p-3">
              <div className="text-sm text-muted-foreground">CHECK-OUT</div>
              <div className="text-base font-medium">
                {formatShortDate(offer.checkOut)}
              </div>
            </div>
          </div>
          <div>
            <div
              className={cn(
                "w-full overflow-hidden rounded-lg border p-4 text-left focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              )}
            >
              <div className="text-sm text-muted-foreground">GUESTS</div>
              <div className="text-base font-medium">
                {offer.request?.numGuests} guests
              </div>
            </div>
          </div>
          {brokedownPrice.totalTripAmount ? (
            <div>
              <div className="mb-1 text-2xl font-bold">Book it now for</div>
              <div className="flex flex-col items-start gap-2">
                <div className="text-4xl font-bold text-primary lg:text-5xl">
                  <span>
                    {formatCurrency(
                      (brokedownPrice.totalTripAmount -
                        brokedownPrice.taxesPaid) /
                        getNumNights(offer.checkIn, offer.checkOut),
                    )}
                  </span>
                  <span className="ml-2 text-lg text-muted-foreground xl:text-xl">
                    Per Night
                  </span>
                </div>
                <Button
                  variant="link"
                  className="flex items-center gap-1 px-0 text-muted-foreground"
                  onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
                >
                  Price Breakdown
                  {showPriceBreakdown ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
                {showPriceBreakdown && (
                  <PriceBreakdownForTravelers offer={offer} />
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col text-center text-lg font-semibold text-destructive">
              {" "}
              Price unavailable{" "}
              <span className="text-center text-xs font-normal">
                Please contact support
              </span>
            </div>
          )}

          {brokedownPrice.totalTripAmount && (
            <BookNowBtn btnSize="lg" offer={offer} property={property} />
          )}
          <p className="my-1 text-center text-sm text-muted-foreground">
            You won&apos;t be charged yet
          </p>
          <Link
            href="/why-list"
            className="block text-center text-primary hover:underline"
          >
            Have a property? List now →
          </Link>
          <PriceCardInformation />
        </CardContent>

        {!offer.acceptedAt && (
          <p className="text-center text-xs text-zinc-500">
            You won&apos;t be charged yet
          </p>
        )}
      </Card>
      <div className="flex gap-2 rounded-xl border border-orange-300 bg-orange-50 p-3 text-orange-800">
        <FlameIcon className="size-7 shrink-0" />
        <div>
          <p className="text-sm font-bold">Tramona exclusive deal</p>
          <p className="text-xs">
            This is an exclusive offer created just for you &ndash; you will not
            be able to find this price anywhere else
          </p>
        </div>
      </div>
      <div className="flex gap-2 rounded-xl border border-blue-300 bg-blue-50 p-3 text-blue-800">
        <InfoIcon className="size-7 shrink-0" />
        <div>
          <p className="text-sm font-bold">Important Notes</p>
          <p className="text-xs">
            These dates could get booked on other platforms for full price. If
            they do, your match will be automatically withdrawn.
            <br />
            <br />
            After 24 hours, this match will become available for the public to
            book.
            <br />
            <br />
            <b>We encourage you to book within 24 hours for best results.</b>
          </p>
        </div>
      </div>
    </div>
  );
}
