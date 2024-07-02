import { type OfferCardDataType } from "@/components/activity-feed/ActivityFeed";
import { Card, CardContent } from "../ui/card";
import { formatCurrency, getNumNights } from "@/utils/utils";
import ShareButton from "@/components/_common/ShareLink/ShareButton";
import UserAvatar from "../_common/UserAvatar";
import BaseCard from "./BaseCard";
import { Bold } from "lucide-react";
import { CarouselDots } from "../_common/carousel-dots";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function FeedofferCard({
  offer,
  children,
}: React.PropsWithChildren<{
  offer: OfferCardDataType;
}>) {
  const userName = offer.request?.madeByGroup.owner.name ?? "";
  const userImage = offer.request?.madeByGroup.owner.image ?? "";
  const numOfNights = getNumNights(offer.checkIn, offer.checkOut);

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
    <BaseCard item={offer} userName={userName} userImage={userImage}>
      <div>
        <p>Recieved a match</p>
        <p>
          Tramona Price:{" "}
          <span className="font-bold text-green-600">
            {formatCurrency(offer.totalPrice / numOfNights)}
          </span>
        </p>
        {offer.property.originalNightlyPrice && (
          <p>
            Airbnb Price: {formatCurrency(offer.property.originalNightlyPrice)}
          </p>
        )}
      </div>
      <Carousel
        setApi={setCarouselApi}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {offer.property.imageUrls.slice(0, 5).map((photo, index) => (
            <CarouselItem
              key={index}
              className="basis-1/2 pl-2 md:basis-1/3 md:pl-4 lg:basis-1/4"
            >
              <Link
                href={`/property/${offer.property.id}`}
                className="relative block aspect-[4/3] overflow-clip rounded-xl"
              >
                <Image
                  src={photo}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  alt=""
                  className="object-cover"
                />
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          className="absolute left-2 top-1/2 size-6 -translate-y-1/2"
          variant={"white"}
        />
        <CarouselNext
          className="absolute right-2 top-1/2 size-6 -translate-y-1/2"
          variant={"white"}
        />
        <CarouselDots count={count} current={current} />
      </Carousel>
    </BaseCard>
  );
}
