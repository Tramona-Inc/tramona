import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { api } from "@/utils/api";
import { type RouterOutputs } from "@/utils/api";
import { AVG_AIRBNB_MARKUP } from "@/utils/constants";
import { formatDateRange, formatCurrency } from "@/utils/utils";
import { InfoIcon, TrashIcon, ExternalLink, CirclePlus } from "lucide-react";
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
  const [displayCount, setDisplayCount] = useState(8);
  const { data: unMatchedOffers, isLoading } =
    api.offers.getAllUnmatchedOffers.useQuery();
  const { data: session } = useSession();

  const handleShowMore = () => {
    setDisplayCount((prevCount) => prevCount + 8);
  };

  return (
    <div className="w-5/6 space-y-2">
      {!isLoading ? (
        unMatchedOffers ? (
          <div className="flex items-center justify-center">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {unMatchedOffers.slice(0, displayCount).map((offer) => (
                <div key={offer.property.id}>
                  <UnMatchedPropertyCard offer={offer} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>Sorry, we currently don&apos;t have any unmatched offers.</div>
        )
      ) : (
        <div className="flex items-center justify-center">
          <div className="grid grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="grid h-[505px] w-[313px] grid-cols-1 rounded-xl text-[16px]"
              >
                <Skeleton className="h-[313px] w-full rounded-xl" />
                <div className="mt-2 flex h-[192px] flex-col space-y-1">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="mt-2 h-[36px] w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {unMatchedOffers && unMatchedOffers.length > displayCount && (
        <div className="flex justify-center">
          <Button
            // variant=""
            // size="lg"
            onClick={handleShowMore}
            className="mt-8 h-[52px] w-[151px] rounded-full border-2 border-[#004236] bg-transparent text-[16px] font-bold text-[#004236] hover:bg-inherit hover:opacity-80"
          >
            Show more
          </Button>
        </div>
      )}
    </div>
  );
}

function UnMatchedPropertyCard({ offer }: { offer: UnMatchedOffers }) {
  const { data: session } = useSession();
  const { mutateAsync: deleteOffer } = api.offers.delete.useMutation();

  const handleButtonClick = (
    event: React.MouseEvent<HTMLDivElement | HTMLButtonElement>,
  ) => {
    event.stopPropagation();
  };

  const handleRemoveProperty = async (offerId: number) => {
    await deleteOffer({ id: offerId });
  };

  return (
    <>
      <div className="grid max-h-[505px] max-w-[313px] grid-cols-1 rounded-xl text-[16px]">
        <div className="relative flex h-[313px] flex-col items-center justify-center">
          <Image
            src={offer.property.imageUrls[0] ?? ""}
            alt=""
            width={150}
            height={130}
            className="flex h-full w-full items-center justify-center rounded-xl"
          />
          <div className="absolute bottom-0 left-0 right-0 flex w-full items-center justify-center rounded-b-xl bg-[#2C72DC] text-[16px] text-[#FFFFFF]">
            {!isNaN(
              Math.floor(
                ((offer.property.originalNightlyPrice! * AVG_AIRBNB_MARKUP -
                  offer.property.originalNightlyPrice!) /
                  (offer.property.originalNightlyPrice! * AVG_AIRBNB_MARKUP)) *
                  100,
              ),
            )
              ? Math.floor(
                  ((offer.property.originalNightlyPrice! * AVG_AIRBNB_MARKUP -
                    offer.property.originalNightlyPrice!) /
                    (offer.property.originalNightlyPrice! *
                      AVG_AIRBNB_MARKUP)) *
                    100,
                )
              : 0}
            % off
          </div>
        </div>
        <div className="mt-2 flex h-[192px] flex-col space-y-1">
          <div className="line-clamp-1 overflow-ellipsis font-bold">
            {offer.property.name}
          </div>
          <div className="flex items-center font-semibold">
            {formatDateRange(offer.checkIn, offer.checkOut)}
          </div>
          <div className="flex">
            <div className="flex items-center font-semibold">
              {offer.property.maxNumGuests} Guests ∙&nbsp;
            </div>
            <div className="flex items-center font-semibold">
              {offer.property.numBedrooms} Bedrooms ∙&nbsp;
            </div>
            <div className="flex items-center font-semibold">Beds ∙&nbsp;</div>
            <div className="flex items-center font-semibold">Bath</div>
          </div>
          <div className="flex items-center font-bold">
            Our price:&nbsp;
            {formatCurrency(offer.property.originalNightlyPrice!)}
          </div>
          <div className="flex items-center text-center font-semibold">
            Price on Airbnb:&nbsp;
            <div className="line-through">
              {formatCurrency(
                offer.property.originalNightlyPrice! * AVG_AIRBNB_MARKUP,
              )}
            </div>
            &nbsp;
            <div className="flex items-center">
              <Link
                href={`/public-offer/${offer.id}`}
                className="font-semibold text-teal-800 underline underline-offset-4"
              >
                <ExternalLink size={18} />
              </Link>
            </div>
          </div>
          <div className="">
            <Link
              href={`/public-offer/${offer.id}`}
            >
              <Button
                className="w-full h-[36px] bg-[#001410] font-semibold hover:opacity-80"
                onClick={handleButtonClick}
              >
                Request to book
              </Button>
            </Link>
          </div>

          <div className="flex flex-row items-center">
          <Button
            variant="ghost"
            size="icon"
            className="col-span-1 font-semibold"
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
            <Button
              size="icon"
              variant="ghost"
              className="text-red-600"
              onClick={() => handleRemoveProperty(offer.id)}
            >
              <TrashIcon />
            </Button>
          )}
          {session?.user.role === "admin" && (
            // <Button
            //   size="icon"
            //   variant="ghost"
            //   className="text-red-600"
            //   onClick={() => handleRemoveProperty(offer.id)}
            // >
            //   <CirclePlus />
            // </Button>
            <AddUnclaimedOffer />
          )}
        </div>
        </div>
      </div>
    </>
  );
}
