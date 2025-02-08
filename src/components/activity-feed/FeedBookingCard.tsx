import { type FeedBookingItem } from "@/components/activity-feed/ActivityFeed";
import { cn, formatCurrency, getNumNights } from "@/utils/utils";
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
import { Button } from "@/components/ui/button";
import BookingDialog from "./admin/BookingDialog";
import { useSession } from "next-auth/react";

export default function FeedBookingCard({
  booking,
}: {
  booking: FeedBookingItem;
}) {
  const { data: session } = useSession();
  const isAdmin = session && session.user.role === "admin";

  const userName = booking.group.owner.firstName ?? "";
  const userImage = booking.group.owner.image ?? "";
  const numOfNights = getNumNights(booking.checkIn, booking.checkOut);
  const discount =
    booking.property.originalNightlyPrice && booking.offer
      ? Math.round(
          (1 -
            booking.offer.totalBasePriceBeforeFees /
              numOfNights /
              booking.property.originalNightlyPrice) *
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
    <BaseCard item={booking} userName={userName} userImage={userImage}>
      <div className="flex">
        <div className=""></div>
        <div className="w-full space-y-2">
          <div className="flex w-full items-start justify-between">
            <div>
              <p className="mb-5">
                Booked a trip to{" "}
                <span className="font-bold">{booking.property.city}</span>
              </p>
              {booking.offer && (
                <p className="font-bold">
                  Tramona Price:{" "}
                  <span className="text-teal-900">
                    {formatCurrency(
                      booking.offer.totalBasePriceBeforeFees / numOfNights,
                    )}
                  </span>
                </p>
              )}
              {booking.property.originalNightlyPrice && (
                <p>
                  <span className="text-muted-foreground">Airbnb Price: </span>
                  <span className="line-through">
                    {formatCurrency(booking.property.originalNightlyPrice)}
                  </span>
                </p>
              )}
            </div>
            {isAdmin && booking.isFiller && (
              <BookingDialog booking={booking}>
                <Button className="ml-auto rounded-full">Edit</Button>
              </BookingDialog>
            )}
          </div>
          <div className="relative">
            <Carousel
              setApi={setCarouselApi}
              className={cn("w-full", discount > 0 ? "mb-10" : "mb-0")}
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {booking.property.imageUrls
                  .slice(0, 5)
                  .map((photo: string, index: number) => (
                    <CarouselItem
                      key={index}
                      className="basis-1/2 pl-2 md:basis-1/3 md:pl-4"
                    >
                      <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`/property/${booking.property.id}`}
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
      {discount > 0 && (
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden rounded-b-lg bg-teal-900 px-4 py-2 text-center font-bold text-white">
          {`${discount}% off`}
        </div>
      )}
    </BaseCard>
  );
}
