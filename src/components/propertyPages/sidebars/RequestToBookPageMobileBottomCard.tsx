import { api } from "@/utils/api";
import { Card, CardContent } from "@/components/ui/card";
import PriceDetailsBeforeTax from "@/components/_common/PriceDetailsBeforeTax";
import { formatDateRange } from "@/utils/utils";
import { PropertyPageData } from "./actionButtons/RequestToBookBtn";
import RequestToBookOrBookNowPriceCard from "./priceCards/RequestToBookOrBookNowPriceCard";
import BookNowBtn from "./actionButtons/BookNowBtn";
import { useRouter } from "next/router";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
export default function RequestToBookPageMobileBottomCard({
  property,
}: {
  // property: Pick<
  //   Property,
  //   "stripeVerRequired" | "originalListingId" | "bookOnAirbnb"
  // >;
  property: PropertyPageData;
}) {
  const { query } = useRouter();
  const checkIn = query.checkIn
    ? new Date(query.checkIn as string)
    : new Date();
  const checkOut = query.checkOut
    ? new Date(query.checkOut as string)
    : new Date();
  const numGuests = query.numGuests ? parseInt(query.numGuests as string) : 2;

  const travelerOfferedPriceBeforeFees = parseInt(
    query.travelerOfferedPriceBeforeFees as string,
  );

  const requestToBook = {
    checkIn,
    checkOut,
    numGuests,
    travelerOfferedPriceBeforeFees,
  };
  const { data: verificationStatus } =
    api.users.myVerificationStatus.useQuery();

  return (
    <Card className="fixed bottom-16 left-0 w-full border-t md:hidden">
      <CardContent className="flex flex-row items-center justify-between px-4 py-1 text-sm">
        <div className="flex basis-1/2 flex-col">
          <PriceDetailsBeforeTax
            property={property}
            requestToBook={requestToBook}
          />
          <p className="font-semibold">
            {formatDateRange(requestToBook.checkIn, requestToBook.checkOut)}
          </p>
        </div>
        <div className="flex flex-row gap-x-2">
          <Dialog>
            <DialogTrigger>
              <Button variant="outline" size="sm" className="tracking-tight">
                Request To Book
              </Button>
            </DialogTrigger>
            <DialogContent>
              <RequestToBookOrBookNowPriceCard property={property} />
            </DialogContent>
          </Dialog>
          {!property.bookItNowEnabled && (
            <BookNowBtn
              btnSize="sm"
              property={property}
              requestToBook={requestToBook}
            />
          )}
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
