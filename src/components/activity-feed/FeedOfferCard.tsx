import { formatCurrency, getNumNights } from "@/utils/utils";
import BaseCard from "./BaseCard";
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
import { cn } from "@/utils/utils";
import { type FeedOfferItem } from "./ActivityFeed";
import { Button } from "@/components/ui/button";
import OfferDialog from "./admin/OfferDialog";
import { useSession } from "next-auth/react";

export default function FeedOfferCard({ offer }: { offer: FeedOfferItem }) {
  const { data: session } = useSession();
  const isAdmin = session && session.user.role === "admin";

  const userName = offer.request?.madeByGroup.owner.name ?? "";
  const userImage = offer.request?.madeByGroup.owner.image ?? "";
  const numOfNights = getNumNights(offer.checkIn, offer.checkOut);
  const discount = offer.property.originalNightlyPrice
    ? Math.round(
        (1 -
          offer.totalPrice /
            numOfNights /
            offer.property.originalNightlyPrice) *
          100,
      )
    : 0;

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
      <div className="flex">
        <div className=""></div>
        <div className="w-full space-y-2">
          <div className="flex w-full items-start justify-between">
            <div>
              <p className="mb-5">Received a match</p>
              <p className="font-bold">
                Tramona Price:{" "}
                <span className="text-teal-900">
                  {formatCurrency(offer.totalPrice / numOfNights)}
                </span>
              </p>
              {offer.property.originalNightlyPrice && (
                <p>
                  <span className="text-muted-foreground">Airbnb Price: </span>
                  <span className="line-through">
                    {offer.isFiller ? formatCurrency(offer.property.originalNightlyPrice) : formatCurrency((offer.totalPrice / numOfNights) / (1 - offer.randomDirectListingDiscount / 100))}
                  </span>
                </p>
              )}
            </div>
            {isAdmin && offer.isFiller && (
              <OfferDialog offer={offer}>
                <Button className="ml-auto rounded-full">Edit</Button>
              </OfferDialog>
            )}
          </div>
          <div className="relative">
            <Carousel
              setApi={setCarouselApi}
              className={cn("w-full mb-10")}
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {offer.property.imageUrls
                  .slice(0, 5)
                  .map((photo: string, index: number) => (
                    <CarouselItem
                      key={index}
                      className="basis-1/2 pl-2 md:basis-1/3 md:pl-4"
                    >
                      <Link
                        target="_blank"
                        rel="noopener noreferrer"
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
          </div>
        </div>
      </div>
      {offer.isFiller && discount > 0 && (
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden rounded-b-lg bg-teal-900 px-4 py-2 text-center font-bold text-white">
          {`${discount}% off`}
        </div>
      )}
      {!offer.isFiller && offer.randomDirectListingDiscount && (
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden rounded-b-lg bg-teal-900 px-4 py-2 text-center font-bold text-white">
          {`${offer.randomDirectListingDiscount}% off`}
        </div>
      )}
    </BaseCard>
  );
}
