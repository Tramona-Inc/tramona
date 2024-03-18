import { useEffect, useState } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import CarouselDots from "@/components/feed/carousel-dots";

import { formatCurrency } from "@/utils/utils";
import Link from "next/link";
import { type RouterOutputs } from "@/utils/api";

// Plugin for relative time
dayjs.extend(relativeTime);

export type OfferWithInfo =
  RouterOutputs["offers"]["getAllPublicOffers"][number];

type Props = {
  deal: OfferWithInfo;
};

export default function SpecialDealsCard({ deal }: Props) {
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

  // Get date difference for expiration timer
  const today = dayjs();
  const dealExpiration = dayjs(dayjs(deal.request.checkIn).diff(today, "date"));

  return (
    <Card className="w-[400px] overflow-clip pb-0 md:w-full">
      <CardContent>
        {/* Image carousel */}
        <Carousel setApi={setApi} className="-mx-4 -mt-4">
          <CarouselContent className="max-h-[400px] min-h-[400px] md:max-h-[350px] md:min-h-[350px]">
            {deal.property.imageUrls.map((image, idx) => (
              <CarouselItem key={idx} className="flex justify-center">
                <Image
                  src={image}
                  alt={`${idx}`}
                  className=""
                  width={500}
                  height={500}
                  layout=""
                  style={{ objectFit: "cover" }}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          {count !== 0 && <CarouselDots count={count} current={current} />}
          <CarouselNext
            className="absolute right-1.5 hidden lg:flex"
            variant="secondary"
          />
          <CarouselPrevious
            className="absolute left-1.5 hidden lg:flex"
            variant="secondary"
          />
        </Carousel>

        {/* Price comparison */}
        <div className="mx-2 mb-1 mt-4 flex items-center justify-between">
          <div className="text-center text-secondary-foreground/50">
            <p className="text-2xl line-through lg:text-xl xl:text-2xl">
              {formatCurrency(deal.property.originalNightlyPrice)}
            </p>
            <p className="text-sm">Airbnb price</p>
          </div>
          <div className="text-center text-secondary-foreground/50">
            <p className="text-2xl font-bold text-primary lg:text-xl xl:text-2xl">
              {formatCurrency(deal.totalPrice)}
            </p>
            <p className="text-sm">Our price</p>
          </div>
          <Link
            href={`/listings/${deal.id}`}
            className={buttonVariants({
              variant: "default",
              className:
                "px-4 py-2 font-semibold text-zinc-50 lg:text-lg xl:px-5 xl:py-6",
            })}
          >
            View Deal
          </Link>
        </div>

        {/* Countdown timer */}
        <div className="-mx-4 mt-4 flex items-center justify-evenly bg-primary py-3 text-center text-zinc-50">
          <div>
            <p className="text-2xl font-bold xl:text-3xl">
              {dealExpiration.format("DD")}
            </p>
            <p className="text-xs font-semibold xl:text-sm">Days</p>
          </div>
          <div>
            <p className="text-2xl font-bold xl:text-3xl">
              {dealExpiration.format("HH")}
            </p>
            <p className="text-xs font-semibold xl:text-sm">Hours</p>
          </div>
          <div>
            <p className="text-2xl font-bold xl:text-3xl">
              {dealExpiration.format("mm")}
            </p>
            <p className="text-xs font-semibold xl:text-sm">Minutes</p>
          </div>
          <div>
            <p className="text-2xl font-bold xl:text-3xl">
              {dealExpiration.format("ss")}
            </p>
            <p className="text-xs font-semibold xl:text-sm">Seconds</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
