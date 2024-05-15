import { CardContent } from "@/components/ui/card";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn, formatCurrency } from "@/utils/utils";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { AVG_AIRBNB_MARKUP } from "@/utils/constants";
import { plural } from "@/utils/utils";
import { api as apiHelper } from "@/utils/api";
import { CarouselDots } from "../_common/carousel-dots";

type BLPropertyCard = {
  propertyId: number;
  bucketListPropertyId: number;
  imageUrls: string[];
  name: string;
  maxNumGuests: number;
  numBathrooms: number | null;
  numBedrooms: number;
  numBeds: number;
  originalNightlyPrice: number | null;
  distance: unknown;
};

export default function BucketListHomeOfferCard({
  property,
}: {
  property: BLPropertyCard;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const { mutate: removePropertyFromBucketList } =
    apiHelper.profile.removeProperty.useMutation();

  return (
    <div className="relative">
      <div className="space-y-2">
        <Carousel setApi={setApi}>
          <CarouselContent>
            {property.imageUrls.slice(0, 5).map((photo, index) => (
              <CarouselItem key={index}>
                <CardContent>
                  <Link href={`/property/${property.propertyId}`}>
                    <Image
                      src={photo}
                      height={300}
                      width={300}
                      alt=""
                      className="aspect-square w-full rounded-xl object-cover"
                    />
                  </Link>
                </CardContent>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            className="absolute left-2 top-1/2 size-6"
            variant={"white"}
          />
          <CarouselNext
            className="absolute right-2 top-1/2 size-6"
            variant={"white"}
          />
          <CarouselDots count={count} current={current} />
        </Carousel>
        <div className="flex flex-col">
          <p className="max-w-full overflow-hidden text-ellipsis text-nowrap font-semibold">
            {property.name}
          </p>
          {property.originalNightlyPrice && (
            <p>
              <span className="text-xs">Airbnb Price: </span>
              {formatCurrency(
                AVG_AIRBNB_MARKUP * property.originalNightlyPrice,
              )}
              <span className="text-xs">/night</span>
            </p>
          )}
        </div>
        <p className="text-xs">
          {plural(property.maxNumGuests, "guest")},{" "}
          {plural(property.numBedrooms, "bedroom")},{" "}
          {plural(property.numBeds, "bed")}
          {property.numBathrooms && (
            <>, {plural(property.numBathrooms, "bath")}</>
          )}
        </p>
      </div>

      <div className="absolute right-2 top-2">
        <Button
          onClick={() =>
            removePropertyFromBucketList(property.bucketListPropertyId)
          }
          className="rounded-full bg-[#333333]/90 hover:bg-[#333333]"
        >
          Added to bucket list
        </Button>
      </div>
    </div>
  );
}
