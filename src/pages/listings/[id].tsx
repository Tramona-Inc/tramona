// import BathBoldIcon from "@/common/components/icons/bath-bold";
// import BedBoldIcon from "@/common/components/icons/bed-bold";
// import EmailIcon from "@/common/components/icons/email";
// import IdentityVerifiedIcon from "@/common/components/icons/identiy-verified";
// import OceanIcon from "@/common/components/icons/ocean";
// import StarIcon from "@/common/components/icons/star";
// import SuperHostIcon from "@/common/components/icons/superhost";
// import PaywallDialog from "@/common/components/paywall-dialog";
import Spinner from "@/components/_common/Spinner";
import UserAvatar from "@/components/_common/UserAvatar";
import EmailIcon from "@/components/_icons/EmailIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type AppRouter } from "@/server/api/root";
import { ALL_PROPERTY_SAFETY_ITEMS } from "@/server/db/schema";
import { api } from "@/utils/api";
import {
  cn,
  formatCurrency,
  formatDateMonthDay,
  getNumNights,
} from "@/utils/utils";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { type inferRouterOutputs } from "@trpc/server";
import { CheckIcon, Loader2Icon, StarIcon, XIcon } from "lucide-react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Listings() {
  const router = useRouter();
  const offerId = parseInt(router.query.id as string);

  const { data: offer } = api.offers.getByIdWithDetails.useQuery({
    id: offerId,
  });

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
  const lisa = false; // temporary until we add payments
  const hostName = property.host?.name ?? property.hostName;
  const lackingSafetyItems = ALL_PROPERTY_SAFETY_ITEMS.filter(
    (i) => !property.safetyItems.includes(i),
  );
  const offerNightlyPrice =
    offer.totalPrice / getNumNights(request.checkIn, request.checkOut);

  return (
    <div className="*:py-4">
      <section className="space-y-4">
        <div className="grid h-[50vh] grid-cols-4 grid-rows-2 gap-2 overflow-clip rounded-xl border">
          {/* <Image
            src={property.imageUrls[0]!}
            alt=""
            className="col-span-2 row-span-2"
            layout="fill"
            objectFit="cover"
            objectPosition="center"
          />
          <Image
            src={property.imageUrls[1]!}
            alt=""
            className="col-span-1 row-span-1"
            layout="fill"
            objectFit="cover"
            objectPosition="center"
          />
          <Image
            src={property.imageUrls[2]!}
            alt=""
            className="col-span-1 row-span-1"
            layout="fill"
            objectFit="cover"
            objectPosition="center"
          />
          <Image
            src={property.imageUrls[3]!}
            alt=""
            className="col-span-1 row-span-1"
            layout="fill"
            objectFit="cover"
            objectPosition="center"
          />
          <Image
            src={property.imageUrls[4]!}
            alt=""
            className="col-span-1 row-span-1"
            layout="fill"
            objectFit="cover"
            objectPosition="center"
          /> */}
          <div className="col-span-2 row-span-2 bg-blue-500"></div>
          <div className="col-span-1 row-span-1 bg-blue-500"></div>
          <div className="col-span-1 row-span-1 bg-blue-500"></div>
          <div className="col-span-1 row-span-1 bg-blue-500"></div>
          <div className="col-span-1 row-span-1 bg-blue-500"></div>
        </div>
        <h1 className="text-lg font-semibold sm:text-3xl">{property.name}</h1>
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-1">
            <Badge
              variant="secondary"
              className="pl-1"
              icon={<StarFilledIcon />}
            >
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
      </section>

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
    </div>
  );
}
