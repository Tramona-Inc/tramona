import { useEffect, useState } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

import type { AppRouter } from "@/server/api/root";
import type { inferRouterOutputs } from "@trpc/server";
import { cn, formatCurrency, formatInterval } from "@/utils/utils";
import Link from "next/link";

// Plugin for relative time
dayjs.extend(relativeTime);

export type OfferWithInfo =
  inferRouterOutputs<AppRouter>["offers"]["getAllOffers"][number];

type Props = {
  deal: OfferWithInfo;
};

function Dot({ isCurrent }: { isCurrent: boolean }) {
  return (
    <div
      className={cn(
        "h-1.5 w-1.5 rounded-full",
        isCurrent ? "h-2.5 w-2.5 bg-white" : "bg-zinc-400",
      )}
    ></div>
  );
}

function CarouselDots({ count, current }: { count: number; current: number }) {
  return (
    <div className="absolute bottom-2 flex w-full justify-center">
      <div className=" flex items-center gap-2 rounded-full bg-zinc-950/50 px-3 py-1">
        {Array(count)
          .fill(null)
          .map((_, idx) => (
            <Dot key={idx} isCurrent={idx === current - 1} />
          ))}
      </div>
    </div>
  );
}

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

  // Format expiration date with days, hours, minutes, seconds
  const today = dayjs();
  const dealExpiration = dayjs(dayjs(deal.request.checkIn).diff(today, "date"));
  console.log(dayjs(dealExpiration));

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
