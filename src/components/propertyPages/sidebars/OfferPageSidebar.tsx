import { Property } from "@/server/db/schema";
import type { OfferWithDetails } from "@/components/propertyPages/PropertyPage";
import { CardContent, Card } from "@/components/ui/card";
import { formatDateWeekMonthDay, plural } from "@/utils/utils";
import BookNowBtn from "./actionButtons/BookNowBtn";
import { InfoIcon, FlameIcon } from "lucide-react";
import PriceDetailsBeforeTax from "@/components/_common/PriceDetailsBeforeTax";

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
    | "bookItNowDiscountTiers"
  >;
}) {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="space-y-4">
          {offer.request && (
            <div className="*:px-4 *:py-2 grid grid-cols-2 rounded-lg border">
              <div className="border-r">
                <p className="text-xs font-bold uppercase text-muted-foreground">
                  Check-in
                </p>
                <p className="font-bold">
                  {formatDateWeekMonthDay(offer.checkIn)}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-muted-foreground">
                  Check-out
                </p>
                <p className="font-bold">
                  {formatDateWeekMonthDay(offer.checkOut)}
                </p>
              </div>
              <div className="col-span-full border-t">
                <p className="text-xs font-bold uppercase text-muted-foreground">
                  Guests
                </p>
                <p className="font-bold">
                  {plural(offer.request.numGuests, "guest")}
                </p>
              </div>
            </div>
          )}
          <BookNowBtn btnSize="lg" offer={offer} property={property} />
          {!offer.acceptedAt && (
            <p className="text-center text-xs text-zinc-500">
              You won&apos;t be charged yet
            </p>
          )}
          <PriceDetailsBeforeTax offer={offer} />
        </CardContent>
      </Card>

      {!property.bookOnAirbnb && (
        <div className="flex gap-2 rounded-xl border border-orange-300 bg-orange-50 p-3 text-orange-800">
          <FlameIcon className="size-7 shrink-0" />
          <div>
            <p className="text-sm font-bold">Tramona exclusive deal</p>
            <p className="text-xs">
              This is an exclusive offer created just for you &ndash; you will
              not be able to find this price anywhere else
            </p>
          </div>
        </div>
      )}
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
