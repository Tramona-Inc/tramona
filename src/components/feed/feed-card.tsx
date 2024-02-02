import Image from "next/image";

import UserAvatar from "@/components/_common/UserAvatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Share } from "lucide-react";

import type { AppRouter } from "@/server/api/root";
import type { inferRouterOutputs } from "@trpc/server";
import {
  formatCurrency,
  formatInterval,
  getDiscountPercentage,
} from "@/utils/utils";

export type FeedWithInfo =
  inferRouterOutputs<AppRouter>["offers"]["getAllOffers"][number];

type Props = {
  offer: FeedWithInfo;
};

export default function FeedCard({ offer }: Props) {
  const name = offer.request.madeByUser.name?.split(" ") ?? [""];

  // Format the time when the offer was created
  const msAgo = Date.now() - offer.createdAt.getTime();
  const showTimeAgo = msAgo > 1000 * 60 * 60;
  const fmtdTimeAgo = showTimeAgo ? `${formatInterval(msAgo)}` : "";

  return (
    <Card className="w-[450px] lg:w-[500px]">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex gap-3">
          <UserAvatar name={name[0]} email={undefined} image={undefined} />
          <div>
            <p className="font-semibold">Booked by {name[0]}</p>
            <p className="text-sm text-secondary-foreground/50">
              {offer.property.name} - {fmtdTimeAgo}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          <Share className="size-4" />
        </Button>
      </CardHeader>

      <CardContent>
        <Carousel className="-mx-4">
          <CarouselContent>
            {offer.property.imageUrls.map((image, idx) => (
              <CarouselItem key={idx} className="flex justify-center">
                <Image
                  src={image}
                  alt={`${idx}`}
                  width={500}
                  height={500}
                  style={{ objectFit: "cover" }}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious variant="darkPrimary" className="absolute left-3" />
          <CarouselNext variant="darkPrimary" className="absolute right-3" />
        </Carousel>

        <div className="mx-2 mb-1 mt-4 flex items-center justify-between">
          <div className="text-center text-secondary-foreground/50">
            <p className="text-2xl font-semibold line-through lg:text-3xl">
              {formatCurrency(offer.property.originalNightlyPrice)}
            </p>
            <p className="text-sm tracking-tight">Airbnb price</p>
          </div>
          <div className="text-center text-secondary-foreground/50">
            <p className="text-2xl font-semibold text-primary lg:text-3xl">
              {formatCurrency(offer.totalPrice)}
            </p>
            <p className="text-sm tracking-tight">Our price</p>
          </div>
          <div className="bg-primary px-4 py-2 text-zinc-50 lg:px-5 lg:py-3">
            <p className="text-lg font-semibold lg:text-xl">
              {getDiscountPercentage(
                offer.property.originalNightlyPrice,
                offer.totalPrice,
              )}
              % OFF
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
