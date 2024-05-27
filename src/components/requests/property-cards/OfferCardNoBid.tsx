import { CardContent } from "@/components/ui/card";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AVG_AIRBNB_MARKUP } from "@/utils/constants";
import { formatCurrency, plural } from "@/utils/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CarouselDots } from "@/components/_common/carousel-dots";
type PropertyCard = {
  id: number;
  imageUrls: string[];
  name: string;
  maxNumGuests: number;
  numBathrooms: number | null;
  numBedrooms: number;
  numBeds: number;
  originalNightlyPrice: number | null;
  distance: unknown;
};

export default function OfferCardNoBid({
  property,
}: {
  property: PropertyCard;
}) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    setCount(carouselApi.scrollSnapList().length);
    setCurrent(carouselApi.selectedScrollSnap() + 1);

    carouselApi.on("select", () => {
      setCurrent(carouselApi.selectedScrollSnap() + 1);
    });
  }, [carouselApi]);

  return (
    <div className="relative">
      <div className="space-y-2">
        <Carousel setApi={setCarouselApi}>
          <CarouselContent>
            {property.imageUrls.slice(0, 5).map((photo, index) => (
              <CarouselItem key={index}>
                <CardContent>
                  <Link href={`/property/${property.id}`}>
                    <Image
                      src={photo}
                      height={500}
                      width={500}
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
          <p className="text-xs font-light">
            {plural(property.maxNumGuests, "guest")},{" "}
            {plural(property.numBedrooms, "bedroom")},{" "}
            {plural(property.numBeds, "bed")}
            {property.numBathrooms && (
              <>, {plural(property.numBathrooms, "bath")}</>
            )}
          </p>
          {property.originalNightlyPrice !== null && (
            <p>
              <span className="text-xs">Airbnb Price: </span>
              {formatCurrency(
                AVG_AIRBNB_MARKUP * property.originalNightlyPrice,
              )}
              <span className="text-xs">/night</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
