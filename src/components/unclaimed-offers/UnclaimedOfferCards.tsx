import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { api } from "@/utils/api";
import { type RouterOutputs } from "@/utils/api";
import { AVG_AIRBNB_MARKUP } from "@/utils/constants";
import { formatDateRange, formatCurrency } from "@/utils/utils";
import { InfoIcon } from "lucide-react";
import { Separator } from "../ui/separator";

export type UnMatchedOffers =
  RouterOutputs["offers"]["getAllUnmatchedOffers"][number];

export default function UnclaimedOfferCard() {
  const { data: unMatchedOffers, isLoading } =
    api.offers.getAllUnmatchedOffers.useQuery();

  //creating the cards
  console.log("This is the offers");
  console.log(unMatchedOffers as UnMatchedOffers[]);

  return (
    <div className="w-5/6 space-y-2">
      <div className="flex flex-col gap-y-3">
        <h2 className=" text-3xl font-semibold">
          Amazing deals happening now!{" "}
        </h2>
        <div className="mb-10 flex flex-row items-center gap-x-1 text-teal-700">
          <InfoIcon size={17} />
          <Link href="/how-it-works" className="underline underline-offset-2">
            {" "}
            How it works
          </Link>
        </div>
        <div className="grid grid-cols-10">
          <div className="col-span-2 font-semibold">Listing</div>
          <div className="col-span-1 font-semibold">Tramona Price</div>
        </div>
        <Separator />
      </div>
      {!isLoading ? (
        unMatchedOffers &&
        unMatchedOffers.map((offer) => (
          <UnMatchedPropertyCard offer={offer} key={offer.property.id} />
        ))
      ) : (
        <div>Loading...</div> // Optional: Add a loading indicator
      )}
    </div>
  );
}

function UnMatchedPropertyCard({ offer }: { offer: UnMatchedOffers }) {
  return (
    <div className="grid grid-cols-10 items-center rounded-xl border pr-8 text-center">
      <Image
        src={offer.property.imageUrls[0] || ""}
        alt=""
        width={150}
        height={130}
        className=" col-span-1 rounded-l-xl"
      />
      <div className="col-span-1 flex items-center justify-center font-bold">
        {offer.property.name}
      </div>
      <div className="col-span-1 flex items-center justify-center font-semibold">
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
      <Button variant="ghost" size="lg" className="col-span-1 font-semibold">
        Share
      </Button>
      <div className="col-span-1 flex items-center justify-center">
        <Link
          href="/requests"
          className="font-semibold text-teal-800 underline underline-offset-4"
        >
          {" "}
          Property Info{" "}
        </Link>
      </div>
      <Button variant="greenPrimary" className="ont-semibold col-span-1">
        Book
      </Button>
    </div>
  );
}
