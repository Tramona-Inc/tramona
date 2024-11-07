import { Card, CardContent } from "@/components/ui/card";
import type { OfferWithDetails } from "../PropertyPage";
import type { Property } from "@/server/db/schema";
import { api } from "@/utils/api";
import PriceDetailsBeforeTax from "@/components/_common/PriceDetailsBeforeTax";
import { formatDateRange } from "@/utils/utils";
import BookNowBtn from "./actionButtons/BookNowBtn";
export default function OfferPageMobileBottomCard({
  offer,
  property,
}: {
  offer: OfferWithDetails;
  property: Pick<
    Property,
    "stripeVerRequired" | "originalListingId" | "bookOnAirbnb"
  >;
}) {
  const { data: verificationStatus } =
    api.users.myVerificationStatus.useQuery();

  return (
    <Card className="fixed bottom-16 left-0 w-full md:hidden">
      <CardContent className="flex flex-row items-center justify-between px-4 py-1 text-sm">
        {offer.request && (
          <div className="flex basis-1/2 flex-col">
            <PriceDetailsBeforeTax offer={offer} />
            <p className="font-semibold">
              {formatDateRange(offer.checkIn, offer.checkOut)}
            </p>
          </div>
        )}
        <div className="flex-1">
          <BookNowBtn btnSize="sm" offer={offer} property={property} />
          {verificationStatus?.isIdentityVerified === "false" &&
            property.stripeVerRequired === true && (
              <p className="text-center text-xs font-semibold text-red-500">
                Host requires Stripe verification prior to booking
              </p>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
