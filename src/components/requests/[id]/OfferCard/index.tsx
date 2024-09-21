import { type RouterOutputs } from "@/utils/api";
import {
  formatCurrency,
  getDiscountPercentage,
  getNumNights,
  plural,
} from "@/utils/utils";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { BathIcon, BedIcon, DoorClosedIcon, Users2Icon } from "lucide-react";
import { type PropsWithChildren } from "react";
import UserAvatar from "../../../_common/UserAvatar";
import SaleTagIcon from "../../../_icons/SaleTagIcon";
import { Badge } from "../../../ui/badge";
import { Card, CardContent, CardFooter } from "../../../ui/card";

export type OfferWithProperty =
  RouterOutputs["offers"]["getByRequestIdWithProperty"][number];

export default function OfferCard({
  offer: { property, ...offer },
  checkIn,
  checkOut,
  children,
}: PropsWithChildren<{
  offer: OfferWithProperty;
  checkIn: Date;
  checkOut: Date;
  requestId: number;
}>) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const hostName = property.host?.name ?? property.hostName;

  const numNights = getNumNights(checkIn, checkOut);
  const offerNightlyPrice = offer.totalPrice / numNights;

  const discountPercentage = getDiscountPercentage(
    property.originalNightlyPrice ?? 0,
    offerNightlyPrice,
  );

  return (
    <Card className="p-0">
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-stretch">
            <div
              className={`relative h-64 w-72 overflow-clip rounded-xl bg-cover bg-center`}
              style={{ backgroundImage: `url(${property.imageUrls[0]})` }}
            >
              <div className="absolute left-4 top-0">
                <SaleTagIcon />
              </div>
              <p className="absolute left-4 top-10 w-24 text-center font-semibold text-primary">
                {discountPercentage}% off
              </p>
            </div>
            <div className="flex flex-1 justify-center gap-4 text-muted-foreground sm:flex-col sm:justify-start">
              <div>
                <p className="text-xs font-semibold uppercase">
                  Original Price
                </p>
                <p>
                  <span className="text-3xl font-bold">
                    {formatCurrency(property.originalNightlyPrice ?? 0)}
                  </span>
                  <span className="text-sm">/night</span>
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase">Tramona Price</p>
                <p>
                  <span className="text-3xl font-bold text-primary">
                    {formatCurrency(offerNightlyPrice)}
                  </span>
                  <span className="text-sm">/night</span>
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase">Total cost</p>
                <p>
                  <span className="text-3xl font-bold text-primary">
                    {formatCurrency(offer.totalPrice)}
                  </span>
                  <span className="text-sm"></span>
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <UserAvatar
              name={hostName}
              email={property.host?.email}
              image={property.host?.image}
            />
            <div className="flex-1 -space-y-1">
              <p className="text-sm text-muted-foreground">
                Hosted by <span className="font-semibold">{hostName}</span>
              </p>
              <p className="text-lg font-semibold">{property.name}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1">
            {property.numRatings > 0 && (
              <Badge variant="secondary" icon={<StarFilledIcon />}>
                {property.avgRating} ({property.numRatings})
              </Badge>
            )}
            <Badge variant="secondary">{property.propertyType}</Badge>
            {property.amenities.length > 0 && (
              <Badge variant="secondary">
                {plural(property.amenities.length, "amenity", "amenities")}
              </Badge>
            )}
          </div>
          <div className="flex gap-6">
            <div className="flex w-72 flex-row gap-5">
              <div>
                <p className="text-sm text-muted-foreground">Beds</p>
                <p className="flex items-center gap-2 text-lg font-semibold text-black">
                  {property.numBeds}{" "}
                  <BedIcon className="text-muted-foreground" />
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bedrooms</p>
                <p className="flex items-center gap-2 text-lg font-semibold text-black">
                  {property.numBedrooms}{" "}
                  <DoorClosedIcon className="text-muted-foreground" />
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bathrooms</p>
                <p className="flex items-center gap-2 text-lg font-semibold text-black">
                  {property.numBathrooms}{" "}
                  <BathIcon className="text-muted-foreground" />
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Accomodates</p>
                <p className="flex items-center gap-2 text-lg font-semibold text-black">
                  {property.maxNumGuests}{" "}
                  <Users2Icon className="text-muted-foreground" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>{children}</CardFooter>
    </Card>
  );
}
