import { Card, CardContent } from "../ui/card";
import { formatDateWeekMonthDay, plural } from "@/utils/utils";
import { Button } from "../ui/button";
import { type OfferWithDetails } from "./PropertyPage";
import {
  BookCheckIcon,
  ArrowRightIcon,
  FlameIcon,
  InfoIcon,
} from "lucide-react";
import Link from "next/link";
import { OfferPriceDetails } from "../_common/OfferPriceDetails";

export default function OfferPageSidebar({
  request,
  offer,
}: {
  request?: OfferWithDetails["request"];
  offer?: OfferWithDetails;
}) {
  const isBooked = !!offer?.acceptedAt;

  return (
    <div className="hidden w-96 shrink-0 lg:block">
      <div className="sticky top-[calc(var(--header-height)+1rem)] space-y-4">
        <Card>
          <CardContent className="space-y-4">
            {request && (
              <div className="grid grid-cols-2 rounded-lg border *:px-4 *:py-2">
                <div className="border-r">
                  <p className="text-xs font-bold uppercase text-muted-foreground">
                    Check-in
                  </p>
                  <p className="font-bold">
                    {formatDateWeekMonthDay(offer?.checkIn ?? new Date())}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-muted-foreground">
                    Check-out
                  </p>
                  <p className="font-bold">
                    {formatDateWeekMonthDay(offer?.checkOut ?? new Date())}
                  </p>
                </div>
                <div className="col-span-full border-t">
                  <p className="text-xs font-bold uppercase text-muted-foreground">
                    Guests
                  </p>
                  <p className="font-bold">
                    {plural(request.numGuests, "guest")}
                  </p>
                </div>
              </div>
            )}
            <Button
              asChild={!isBooked}
              variant="greenPrimary"
              size="lg"
              className="w-full"
              disabled={isBooked}
            >
              {isBooked ? (
                <>
                  <BookCheckIcon className="size-5" />
                  Booked
                </>
              ) : (
                <Link href={`/offer-checkout/${offer?.id}`}>
                  Book now
                  <ArrowRightIcon className="size-5" />
                </Link>
              )}
            </Button>
            <OfferPriceDetails offer={offer} />
          </CardContent>
        </Card>
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
    </div>
  );
}
