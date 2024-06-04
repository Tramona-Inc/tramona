import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { api } from "@/utils/api";
import { type RouterOutputs } from "@/utils/api";
import { AVG_AIRBNB_MARKUP } from "@/utils/constants";
import { formatDateRange, formatCurrency } from "@/utils/utils";
import { InfoIcon, ShareIcon } from "lucide-react";
import { Separator } from "../ui/separator";
import { Skeleton, SkeletonText } from "../ui/skeleton";
export type UnMatchedOffers =
  RouterOutputs["offers"]["getAllUnmatchedOffers"][number];

export default function UnclaimedOfferCard() {
  const { data: unMatchedOffers, isLoading } =
    api.offers.getAllUnmatchedOffers.useQuery();

  return (
    <div className="w-5/6 space-y-2">
      <div className="flex flex-col gap-y-1">
        <h2 className="text-3xl font-semibold">Amazing deals happening now!</h2>
        <div className="mb-10 flex flex-row items-center gap-x-1 text-teal-700">
          <InfoIcon size={18} strokeWidth={2.4} />
          <Link href="/how-it-works" className="underline underline-offset-2">
            How it works
          </Link>
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
          unMatchedOffers.map((offer, index) => (
            <div key={offer.property.id}>
              <UnMatchedPropertyCard offer={offer} />
              {index === 2 && (
                <div className="flex flex-row">
                  <Image
                    src="/path/to/your/image.jpg" // Replace with the actual path to your image
                    alt="Custom Image"
                    width={500}
                    height={300}
                  />
                </div>
              )}
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
    </div>
  );
}

function UnMatchedPropertyCard({ offer }: { offer: UnMatchedOffers }) {
  return (
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
        {formatDateRange(offer.request.checkIn, offer.request.checkOut)}
      </div>
      <div className="col-span-1 flex items-center justify-center font-semibold">
        {offer.property.maxNumGuests}
      </div>
      <div className="col-span-1 flex items-center justify-center font-semibold">
        {offer.property.numBedrooms}
      </div>
      <div className="col-span-1 flex items-center justify-center">
        <Link
          href="/requests"
          className="font-semibold text-teal-800 underline underline-offset-4"
        >
          {" "}
          Property Info{" "}
        </Link>
      </div>
      <Button
        variant="greenPrimary"
        className="col-span-1 ml-2 px-20 font-semibold"
      >
        Book
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="col-span-1  ml-12 font-semibold"
      >
        <ShareIcon />
      </Button>
    </div>
  );
}
