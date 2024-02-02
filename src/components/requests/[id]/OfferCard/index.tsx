import { type AppRouter } from "@/server/api/root";
import {
  cn,
  formatCurrency,
  getDiscountPercentage,
  getNumNights,
  plural,
} from "@/utils/utils";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { type inferRouterOutputs } from "@trpc/server";
import { BedIcon, DoorClosedIcon, Users2Icon } from "lucide-react";
import Link from "next/link";
import UserAvatar from "../../../_common/UserAvatar";
import SaleTagIcon from "../../../_icons/SaleTagIcon";
import { Badge } from "../../../ui/badge";
import { Button, buttonVariants } from "../../../ui/button";
import { Card, CardFooter } from "../../../ui/card";
import PaywallDialog from "../PaywallDialog";
import HowToBookDialog from "./HowToBookDialog";

export type OfferWithProperty =
  inferRouterOutputs<AppRouter>["offers"]["getByRequestIdWithProperty"][number];

export default function OfferCard({
  offer: { property, ...offer },
  checkIn,
  checkOut,
  requestId,
}: {
  offer: OfferWithProperty;
  checkIn: Date;
  checkOut: Date;
  requestId: number;
}) {
  const lisa = false; // temporary until we add payments
  const hostName = property.host?.name ?? property.hostName;
  const offerNightlyPrice = offer.totalPrice / getNumNights(checkIn, checkOut);
  const numAmenities =
    property.amenities.length + property.standoutAmenities.length;
  const discountPercentage = getDiscountPercentage(
    property.originalNightlyPrice,
    offerNightlyPrice,
  );

  const isAirbnb =
    property.airbnbUrl === null || property.airbnbUrl === "" ? false : true;

  return (
    <Card className={cn(lisa && "p-0", "overflow-clip")}>
      {lisa && (
        <div className="mb-2 bg-gold p-2.5 text-center text-sm font-medium text-black">
          Must be a Tramona Lisa member to book this deal!
        </div>
      )}
      <div className={cn("space-y-4", lisa && "p-4 pt-0")}>
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
          <div className="flex flex-1 items-center gap-4 text-muted-foreground sm:flex-col">
            <div>
              <p className="text-xs font-semibold uppercase">Original Price</p>
              <p>
                <span className="text-3xl font-bold">
                  {formatCurrency(property.originalNightlyPrice)}
                </span>
                <span className="text-sm">/night</span>
              </p>
            </div>
            <div>
              <p className="text-center text-xs font-semibold uppercase">
                Tramona Price
              </p>
              <p>
                <span className="text-3xl font-bold text-primary">
                  {formatCurrency(offerNightlyPrice)}
                </span>
                <span className="text-sm">/night</span>
              </p>
            </div>
            <div>
              <p className="text-md font-bold uppercase text-black text-primary">
                Total Cost
              </p>
              <p>
                <span className="text-3xl font-bold text-primary">
                  {formatCurrency(offer.totalPrice)}
                </span>
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
          <Badge variant="secondary" icon={<StarFilledIcon />}>
            {property.avgRating} ({property.numRatings})
          </Badge>
          <Badge variant="secondary">{property.propertyType}</Badge>
          <Badge variant="secondary">
            {plural(numAmenities, "amenity", "amenities")}
          </Badge>
        </div>
        <div className="flex gap-6">
          <div className="flex w-72 flex-row gap-5">
            <div>
              <p className="text-sm text-muted-foreground">Beds</p>
              <p className="flex items-center gap-2 text-lg font-semibold text-black">
                {property.numBeds} <BedIcon className="text-muted-foreground" />
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
              <p className="text-sm text-muted-foreground">Accomodates</p>
              <p className="flex items-center gap-2 text-lg font-semibold text-black">
                {property.maxNumGuests}{" "}
                <Users2Icon className="text-muted-foreground" />
              </p>
            </div>
          </div>
        </div>
        <CardFooter>
          <Link
            href={`/listings/${offer.id}`}
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "rounded-full",
            )}
          >
            See Listing
          </Link>
          {lisa ? (
            <PaywallDialog>
              <Button size="lg" variant="gold" className="rounded-lg">
                Join Tramona Lisa
              </Button>
            </PaywallDialog>
          ) : (
            <HowToBookDialog
              isBooked={false} // default will always be false in request page
              listingId={offer.id}
              propertyName={property.name}
              offerNightlyPrice={offerNightlyPrice}
              totalPrice={offer.totalPrice}
              originalNightlyPrice={property.originalNightlyPrice}
              airbnbUrl={property.airbnbUrl}
              checkIn={checkIn}
              checkOut={checkOut}
              requestId={requestId}
              offer={{ property, ...offer }}
              isAirbnb={isAirbnb} 
            >
              <Button size="lg" className="min-w-32 rounded-full">
                Book
              </Button>
            </HowToBookDialog>
          )}
        </CardFooter>
      </div>
    </Card>
  );
}
