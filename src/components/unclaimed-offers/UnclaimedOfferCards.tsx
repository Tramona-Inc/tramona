import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { api } from "@/utils/api";
import { type RouterOutputs } from "@/utils/api";
import { AVG_AIRBNB_MARKUP } from "@/utils/constants";
import { formatDateRange, formatCurrency } from "@/utils/utils";
import { InfoIcon, TrashIcon } from "lucide-react";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";
import { useState } from "react";
import ShareOfferDialog from "../_common/ShareLink/ShareOfferDialog";
import { useSession } from "next-auth/react";
import React from "react";

import AddUnclaimedOffer from "./AddUnclaimedOffer";
export type UnMatchedOffers =
  RouterOutputs["offers"]["getAllUnmatchedOffers"][number];

export default function UnclaimedOfferCard() {
  const [showMore, setShowMore] = useState(false);
  const { data: unMatchedOffers, isLoading } =
    api.offers.getAllUnmatchedOffers.useQuery();
  const { data: session } = useSession();
  return (
    <div className="w-5/6 space-y-2">
      <div className="flex flex-col gap-y-1">
        <h2 className="text-3xl font-semibold">Amazing deals happening now!</h2>
        <div className="flex flex-row items-center justify-between">
          <div className="mb-10 flex flex-row items-center gap-x-1 text-teal-700">
            <InfoIcon size={18} strokeWidth={2.4} />
            <Link href="/how-it-works" className="underline underline-offset-2">
              How it works
            </Link>
          </div>
          {session && session.user.role === "admin" && <AddUnclaimedOffer />}
        </div>
        <div className="relative">
          <div className="sticky top-0 grid grid-cols-10 gap-x-2 bg-white text-center font-bold">
            <div className="col-span-2 text-left font-bold">Listing</div>
            <div className="col-span-1">Airbnb Price</div>
            <div className="col-span-1">Tramona Price</div>
            <div className="col-span-1">Dates</div>
            <div className="col-span-1">Guests</div>
            <div className="col-span-1">Beds</div>
          </div>
          <Separator className="bg-black" />
        </div>
      </div>
      {!isLoading ? (
        unMatchedOffers ? (
          unMatchedOffers.map((offer) => (
            <div key={offer.property.id}>
              <UnMatchedPropertyCard offer={offer} />
            </div>
          ))
        ) : (
          <div>Sorry, we currently don&apos;t have any unmatched offers.</div>
        )
      ) : (
        <div className="flex-1 px-6 text-sm">
          <div className="flex flex-row gap-x-4 ">
            <Skeleton className="h-20 w-32 rounded-lg" />
            <Skeleton className="h-20 w-11/12 rounded-lg" />
          </div>
        </div>
      )}
      <div className="flex justify-center">
        <Button
          variant="secondary"
          size="lg"
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? "Show Less" : "Show More"}
        </Button>
      </div>
    </div>
  );
}

function UnMatchedPropertyCard({ offer }: { offer: UnMatchedOffers }) {
  const { data: session } = useSession();

  const handleButtonClick = (
    event: React.MouseEvent<HTMLDivElement | HTMLButtonElement>,
  ) => {
    event.stopPropagation();
  };

  return (
    <Link href={`/public-offer/${offer.id}`} className="">
      <div className="grid grid-cols-10 items-center gap-x-2 rounded-xl border text-center">
        <Image
          src={offer.property.imageUrls[0] ?? ""}
          alt=""
          width={150}
          height={130}
          className=" col-span-1 h-24 rounded-l-xl"
        />
        <div className="ellipsis col-span-1 flex max-h-24 items-center justify-center px-1 font-bold">
          {offer.property.name}
        </div>
        <div className="col-span-1 flex items-center justify-center text-center font-semibold">
          {formatCurrency(
            offer.property.originalNightlyPrice! * AVG_AIRBNB_MARKUP,
          )}
        </div>
        <div className="col-span-1 flex items-center justify-center font-semibold">
          {formatCurrency(offer.property.originalNightlyPrice!)}
        </div>
        <div className="col-span-1 flex items-center justify-center font-semibold">
          {formatDateRange(offer.checkIn, offer.checkOut)}
        </div>
        <div className="col-span-1 flex items-center justify-center font-semibold">
          {offer.property.maxNumGuests}
        </div>
        <div className="col-span-1 flex items-center justify-center font-semibold">
          {offer.property.numBedrooms}
        </div>
        <div className="col-span-1 flex items-center justify-center">
          <Link
            href={`/public-offer/${offer.id}`}
            className="font-semibold text-teal-800 underline underline-offset-4"
          >
            Property Info
          </Link>
        </div>
        <Button
          variant="greenPrimary"
          className="col-span-1 ml-2 px-20 font-semibold"
          onClick={handleButtonClick}
        >
          Book
        </Button>
        <div className="flex flex-row gap-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="col-span-1  ml-12 font-semibold"
            onClick={handleButtonClick}
          >
            <div onClick={handleButtonClick}>
              <ShareOfferDialog
                id={offer.id}
                isRequest={false}
                propertyName={offer.property.name}
              />
            </div>
          </Button>
          {session?.user.role === "admin" && (
            <Button size="icon" variant="ghost" className="text-red-600">
              <TrashIcon />
            </Button>
          )}
        </div>
      </div>
    </Link>
  );
}
