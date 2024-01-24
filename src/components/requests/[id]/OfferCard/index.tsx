import { type inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "@/server/api/root";
import { Button } from "../../../ui/button";
import PaywallDialog from "../PaywallDialog";
import { BedIcon, DoorClosedIcon, Users2Icon } from "lucide-react";
import UserAvatar from "../../../_common/UserAvatar";
import HowToBookDialog from "./HowToBookDialog";
import SaleTagIcon from "../../../_icons/SaleTagIcon";
import { Badge } from "../../../ui/badge";
import { Card, CardFooter } from "../../../ui/card";
import { cn, formatCurrency } from "@/utils/utils";

export type OfferWithProperty =
  inferRouterOutputs<AppRouter>["offers"]["getByRequestIdWithProperty"][number];

export default function OfferCard({
  offer: { property, ...offer },
  checkIn,
  checkOut,
}: {
  offer: OfferWithProperty;
  checkIn: Date;
  checkOut: Date;
}) {
  const lisa = false; // temporary until we add payments
  const hostName = property.host?.name ?? property.hostName;

  return (
    <Card className={cn(lisa && "p-0", "overflow-clip")}>
      {lisa && (
        <div className="mb-2 bg-[#FACF26] p-2.5 text-center text-sm font-medium text-black">
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
              {Math.round(
                100 * (1 - offer.totalPrice / property.originalNightlyPrice), // TODO fix
              )}
              % off
            </p>
          </div>
          <div className="flex flex-1 gap-4 text-muted-foreground sm:flex-col">
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
              <p className="text-xs font-semibold uppercase">Tramona Price</p>
              <p>
                <span className="text-3xl font-bold text-primary">
                  {formatCurrency(offer.totalPrice)}
                </span>
                <span className="text-sm">/night</span>
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
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{property.propertyType}</Badge>
          <Badge variant="secondary" className="pl-1 pr-2">
            ★ {property.avgRating} ({property.numRatings})
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
          {/* <Button size="lg" variant="outline" className="rounded-full">
            <Link href={`/listings/${property.id}`}>See Listing</Link>
          </Button> */}
          {lisa ? (
            <PaywallDialog>
              <Button
                size="lg"
                className="rounded-full bg-[#FACF26] text-black hover:bg-[#FACF26]/90"
              >
                Join Tramona Lisa
              </Button>
            </PaywallDialog>
          ) : (
            <HowToBookDialog
              totalPrice={offer.totalPrice}
              airbnbUrl={property.airbnbUrl}
              checkIn={checkIn}
              checkOut={checkOut}
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
