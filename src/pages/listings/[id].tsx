// import BathBoldIcon from "@/common/components/icons/bath-bold";
// import BedBoldIcon from "@/common/components/icons/bed-bold";
// import EmailIcon from "@/common/components/icons/email";
// import IdentityVerifiedIcon from "@/common/components/icons/identiy-verified";
// import OceanIcon from "@/common/components/icons/ocean";
// import StarIcon from "@/common/components/icons/star";
// import SuperHostIcon from "@/common/components/icons/superhost";
// import PaywallDialog from "@/common/components/paywall-dialog";
import Spinner from "@/components/_common/Spinner";
import UserAvatar from '@/components/_common/UserAvatar';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { type AppRouter } from '@/server/api/root';
import { ALL_PROPERTY_SAFETY_ITEMS } from '@/server/db/schema';
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
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Listings() {
  useSession({ required: true });
  const router = useRouter();
  const offerId = parseInt(router.query.id as string);

  const { data: offer } = api.offers.getByIdWithDetails.useQuery(
    { id: offerId },
    {
      enabled: router.isReady,
    },
  );

  return (
    <>
      <Head>
        <title>Listings Property Preview | Tramona</title>
      </Head>
      <div className="px-4 pb-64 pt-16">
        <div className="mx-auto max-w-5xl">
          {offer ? <OfferPage offer={offer} /> : <Spinner />}
        </div>
      </div>
    </>
  );
}

export type OfferWithDetails =
  inferRouterOutputs<AppRouter>["offers"]["getByIdWithDetails"];

function OfferPage({
  offer: { property, request, ...offer },
}: {
  offer: OfferWithDetails;
}) {
  // const lisa = false; // temporary until we add payments
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
        href={`/requests/${request.id}`}
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
          <h1 className="items-center text-xl font-semibold sm:text-3xl">
            {property.name}{" "}
            <Badge className=" -translate-y-0.5 bg-primary text-white sm:-translate-y-1">
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
            <div className="flex items-center gap-1">
              <CalendarIcon className="size-4" />
              <p className="mr-3">{fmtdDateRange}</p>
              <UsersIcon className="size-4" />
              <p>{fmtdNumGuests}</p>
            </div>
            <Button size="lg" className="w-full">
              Book ({formatCurrency(offer.totalPrice)} total)
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}