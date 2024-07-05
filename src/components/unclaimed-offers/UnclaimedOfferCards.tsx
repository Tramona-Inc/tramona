import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { api } from "@/utils/api";
import { type RouterOutputs } from "@/utils/api";
import { AVG_AIRBNB_MARKUP } from "@/utils/constants";
import { formatDateRange, formatCurrency } from "@/utils/utils";
import { InfoIcon, TrashIcon, ExternalLink } from "lucide-react";
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
      {/* <div className="flex flex-col gap-y-1">
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
      </div> */}
      {!isLoading ? (
        unMatchedOffers ? (
          <div className="flex items-center justify-center">
            <div className="grid grid-cols-4 gap-6">
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
      <div className="grid h-[505px] w-[313px] grid-cols-1 rounded-xl text-[16px]">
        <div className="flex h-[313px] items-center justify-center">
          <Image
            src={offer.property.imageUrls[0] ?? ""}
            alt=""
            width={150}
            height={130}
            className="flex max-h-[313px] w-full max-w-[313px] items-center justify-center rounded-xl"
          />
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
            {formatCurrency(
              offer.property.originalNightlyPrice! * AVG_AIRBNB_MARKUP,
            )}
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

          <Button
            className="h-[36px] bg-[#001410] font-semibold"
            onClick={handleButtonClick}
          >
            Request to book
          </Button>
          {/* <div className="flex flex-row">
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
        </div> */}
        </div>
      </div>
    </>
  );
}
