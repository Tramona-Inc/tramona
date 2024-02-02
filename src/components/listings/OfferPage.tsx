import UserAvatar from "@/components/_common/UserAvatar";
import HowToBookDialog from "@/components/requests/[id]/OfferCard/HowToBookDialog";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type AppRouter } from "@/server/api/root";
import { ALL_PROPERTY_SAFETY_ITEMS } from "@/server/db/schema";
import { api } from "@/utils/api";
import {
  cn,
  formatCurrency,
  formatDateRange,
  getDiscountPercentage,
  getNumNights,
  plural,
} from "@/utils/utils";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { type inferRouterOutputs } from "@trpc/server";
import { CalendarIcon, CheckIcon, UsersIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Spinner from "../_common/Spinner";

export type OfferWithDetails =
  inferRouterOutputs<AppRouter>["offers"]["getByIdWithDetails"];

export default function OfferPage({
  offer: { property, request, ...offer },
}: {
  offer: OfferWithDetails;
}) {
  let isBooked = false;

  const { data, isLoading } =
    api.offers.getStripePaymentIntentAndCheckoutSessionId.useQuery({
      id: offer.id,
    });

  if (data?.checkoutSessionId !== null && data?.paymentIntentId !== null) {
    isBooked = true;
  }

  const isAirbnb =
    property.airbnbUrl === null || property.airbnbUrl === "" ? false : true;

  const lisa = false; // temporary until we add payments
  const hostName = property.host?.name ?? property.hostName;
  const lackingSafetyItems = ALL_PROPERTY_SAFETY_ITEMS.filter(
    (i) => !property.safetyItems.includes(i),
  );
  const offerNightlyPrice =
    offer.totalPrice / getNumNights(request.checkIn, request.checkOut);

  const discountPercentage = getDiscountPercentage(
    property.originalNightlyPrice,
    offerNightlyPrice,
  );

  const fmtdDateRange = formatDateRange(request.checkIn, request.checkOut);
  const fmtdNumGuests = plural(request.numGuests, "guest");

  return (
    <div className="space-y-4">
      <Link
        href={isBooked ? "/requests" : `/requests/${request.id}`}
        className={cn(buttonVariants({ variant: "ghost" }), "rounded-full")}
      >
        &larr; Back to all offers
      </Link>
      <div className="grid h-[50vh] grid-cols-4 grid-rows-2 gap-2 overflow-clip rounded-xl">
        <div className="relative col-span-2 row-span-2 bg-accent">
          <Image
            src={property.imageUrls[0]!}
            alt=""
            fill
            objectFit="cover"
            priority
          />
        </div>
        <div className="relative col-span-1 row-span-1 bg-accent">
          <Image src={property.imageUrls[1]!} alt="" fill objectFit="cover" />
        </div>
        <div className="relative col-span-1 row-span-1 bg-accent">
          <Image src={property.imageUrls[2]!} alt="" fill objectFit="cover" />
        </div>
        <div className="relative col-span-1 row-span-1 bg-accent">
          <Image src={property.imageUrls[3]!} alt="" fill objectFit="cover" />
        </div>
        <div className="relative col-span-1 row-span-1 bg-accent">
          <Image src={property.imageUrls[4]!} alt="" fill objectFit="cover" />
        </div>
      </div>
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <div className="flex-[2] space-y-4">
          <h1 className="items-center text-lg font-semibold sm:text-3xl">
            {property.name}{" "}
            <Badge className=" -translate-y-1 bg-primary text-white">
              {discountPercentage}% off
            </Badge>
          </h1>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-1">
              <Badge variant="secondary" icon={<StarFilledIcon />}>
                {property.avgRating} ({property.numRatings})
              </Badge>
              <Badge variant="secondary">{property.propertyType}</Badge>
              {property.amenities.map((amenity) => (
                <Badge variant="secondary" key={amenity}>
                  {amenity}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-1">
              {property.standoutAmenities.map((amenity) => (
                <Badge
                  variant="secondary"
                  icon={<CheckIcon className="size-4" />}
                  key={amenity}
                >
                  {amenity}
                </Badge>
              ))}
              {lackingSafetyItems.map((amenity) => (
                <Badge
                  variant="secondary"
                  icon={<XIcon className="size-4" />}
                  key={amenity}
                >
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>

          <section>
            <div className="flex items-center gap-2">
              <UserAvatar
                name={hostName}
                email={property.host?.email}
                image={property.host?.image}
              />
              <div className="-space-y-1.5">
                <p className="text-sm text-muted-foreground">Hosted by</p>
                <p className="text-lg font-semibold">{hostName}</p>
              </div>
            </div>
          </section>
          <section>
            <div className="rounded-lg bg-zinc-200 px-4 py-2 text-zinc-600">
              <div className="line-clamp-3 ">{property.about}</div>
              <div className="flex justify-end">
                <Dialog>
                  <DialogTrigger className="text-foreground underline underline-offset-2">
                    Read more
                  </DialogTrigger>

                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>About this property</DialogTitle>
                      <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <p className="py-2">{property.about}</p>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </section>
        </div>
        <Card className="flex-1">
          <div className="space-y-4 text-muted-foreground">
            <div className="-space-y-1">
              <p className="text-sm line-through">
                {formatCurrency(property.originalNightlyPrice)}/night
              </p>
              <p>
                <span className="text-4xl font-extrabold tracking-tight text-primary">
                  {formatCurrency(offerNightlyPrice)}
                </span>
                /night ({discountPercentage}% off)
              </p>
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-black">Total Price</h1>
              <p className="text-2xl text-primary">
                {formatCurrency(offer.totalPrice)}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <CalendarIcon className="size-4" />
              <p className="mr-3">{fmtdDateRange}</p>
              <UsersIcon className="size-4" />
              <p>{fmtdNumGuests}</p>
            </div>
            {!isLoading ? (
              <HowToBookDialog
                isBooked={isBooked}
                listingId={offer.id}
                propertyName={property.name}
                originalNightlyPrice={property.originalNightlyPrice}
                airbnbUrl={property.airbnbUrl}
                checkIn={request.checkIn}
                checkOut={request.checkOut}
                requestId={request.id}
                offer={{ property, ...offer }}
                totalPrice={offer.totalPrice}
                offerNightlyPrice={offerNightlyPrice}
                isAirbnb={isAirbnb} 
              >
                <Button size="lg" className="w-full">
                  {isBooked ? "Booked ✓" : "Book Now"}
                </Button>
              </HowToBookDialog>
            ) : (
              <Spinner />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
