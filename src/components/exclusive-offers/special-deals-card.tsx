import { useEffect, useState } from "react";
import Image from "next/image";

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

  return (
    <Card className="w-[400px] overflow-clip md:w-full">
      <CardContent>
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
            href={"/"}
            className={buttonVariants({
              variant: "default",
              className:
                "px-4 py-2 font-semibold text-zinc-50 lg:text-lg xl:px-5 xl:py-6",
            })}
          >
            View Deal
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
