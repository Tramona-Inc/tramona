import {
  formatCurrency,
  formatDateRange,
  getNumNights,
  plural,
} from "@/utils/utils";
import { ClockIcon } from "lucide-react";
import { Card, CardFooter } from "@/components/ui/card";
// import RequestGroupAvatars from "./RequestGroupAvatars";
import UserAvatar from "@/components/_common/UserAvatar";
import { TravelerVerificationsDialog } from "@/components/requests/TravelerVerificationsDialog";
import { formatDistanceToNowStrict } from "date-fns";
import { Offer, User } from "@/server/db/schema";

export type PastOfferRequestDetails = {
  id: number;
  madeByGroupId: number;
  maxTotalPrice: number;
  checkIn: Date;
  checkOut: Date;
  numGuests: number;
  location: string;
  traveler: Pick<
    User,
    "firstName" | "lastName" | "name" | "image" | "location" | "about"
  >;
};

export default function PastOfferCard({
  request,
  offer,
  property,
  children,
}: {
  offer: Offer;
  request: PastOfferRequestDetails;
  property: { city: string; name: string };
  children?: React.ReactNode;
}) {
  const requestPricePerNight =
    request.maxTotalPrice / getNumNights(offer.checkIn, offer.checkOut);
  const fmtdRequestPrice = formatCurrency(requestPricePerNight);
  const offerPricePerNight =
    offer.totalBasePriceBeforeFees /
    getNumNights(offer.checkIn, offer.checkOut);
  const fmtdOfferPrice = formatCurrency(offerPricePerNight);
  const fmtdDateRange = formatDateRange(offer.checkIn, offer.checkOut);
  const fmtdNumGuests = plural(request.numGuests, "guest");

  return (
    <Card className="overflow-hidden p-0">
      {/* {offer.id} */}
      <div className="flex">
        <div className="flex-1 space-y-4 overflow-hidden p-4 pt-2">
          <div className="flex items-center gap-2">
            <UserAvatar
              size="sm"
              name={request.traveler.name}
              image={request.traveler.image}
            />
            <TravelerVerificationsDialog request={request} />
            <p>&middot;</p>
            <p>
              Sent&nbsp;
              {formatDistanceToNowStrict(offer.createdAt, {
                addSuffix: true,
              })}
            </p>
            <div className="flex-1" />
          </div>
          <div className="space-y-1">
            <div>
              <p className="font-bold">{property.name}</p>
              <p>
                Requested{" "}
                <span className="font-medium">{fmtdRequestPrice}</span>
                /night
              </p>
              <p>
                Offered <span className="font-medium">{fmtdOfferPrice}</span>
                /night
              </p>
              <p className="mt-3 flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <ClockIcon className="h-4 w-4" />
                  {fmtdDateRange}
                </span>
                &middot;
                <span className="flex items-center gap-1">{fmtdNumGuests}</span>
              </p>
            </div>
          </div>
          <CardFooter className="empty:hidden">{children}</CardFooter>
        </div>
      </div>
    </Card>
  );
}
