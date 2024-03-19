import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { useEffect, useState } from "react";

import UserAvatar from "@/components/_common/UserAvatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import {
//   Dialog,
//   DialogHeader,
//   DialogContent,
//   DialogTrigger,
//   DialogClose,
//   DialogTitle,
// } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Share } from "lucide-react";
import CarouselDots from "./carousel-dots";

// import type { AppRouter } from "@/server/api/root";
// import type { inferRouterOutputs } from "@trpc/server";
import { getDiscountPercentage } from "@/utils/utils";
import { type LiveFeedOffer } from "../offer-card/data";

// Plugin for relative time
dayjs.extend(relativeTime);

type Props = {
  offer: LiveFeedOffer;
};

// export type FeedWithInfo =
//   RouterOutputs["offers"]["getAllOffers"][number];

// type Props = {
//   offer: FeedWithInfo;
// };

// function ModalButton({ icon, text }: { icon: ReactNode; text: string }) {
//   return (
//     <div className="flex flex-col items-center">
//       <Button variant="secondary" size="icon" className="rounded-full">
//         {icon}
//       </Button>
//       <p className="text-sm">{text}</p>
//     </div>
//   );
// }

// function ShareModal() {
//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="ghost" size="sm">
//           <Share className="size-4" />
//         </Button>
//       </DialogTrigger>

//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Share with</DialogTitle>
//         </DialogHeader>
//         <div className="grid grid-cols-4">
//           <ModalButton icon={<Link className="size-20" />} text="Copy link" />
//           <ModalButton icon={<MessageCircle />} text="Message" />
//           <ModalButton icon={<Mail />} text="Email" />
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

export default function FeedCard({ offer }: Props) {
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

  // const name = offer.request.madeByUser.name?.split(" ") ?? [""];
  const name = offer.hostName;

  // Format the time when the offer was completed at
  // const offerDate = dayjs(offer.request.resolvedAt).fromNow();

  return (
    <Card className="w-[390px] md:w-[450px] lg:w-[500px]">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex gap-3">
          <UserAvatar
            name={name[0]}
            email={undefined}
            image={offer.hostPicUrl}

            // image={offer.request.madeByUser.image}
          />
          <div>
            {/* <p className="font-semibold">Booked by {name[0]}</p> */}
            <p className="font-semibold">Booked by Anonymous</p>
            <p className="text-sm text-secondary-foreground/50">
              {/* {offer.request.madeByUser.name} - {offerDate} */}
              Hosted by {offer.hostName}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" disabled>
          <Share className="size-4" />
        </Button>
      </CardHeader>

      <CardContent>
        <Carousel setApi={setApi} className="-mx-4">
          {/* <CarouselContent className="max-h-[500px] min-h-[500px]"> */}
          <CarouselContent>
            {/* {offer.property.imageUrls.map((image, idx) => ( */}
            {/* // <CarouselItem key={idx} className="flex justify-center -pl-4"> */}
            <CarouselItem key={0} className=" -pl-5 -pt-5">
              <div className="relative flex h-[500px]">
                <Image
                  src={offer.imageUrl}
                  alt={`${0}`}
                  // width={2000}
                  // height={2000}
                  // layout="fill"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  fill
                  priority
                  style={{
                    objectFit: "cover",
                  }}
                />
              </div>
            </CarouselItem>

            {/* ))} */}
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

        <div className="mx-2 mb-1 mt-4 flex items-center justify-between">
          <div className="text-center text-secondary-foreground/50">
            <p className="text-2xl font-semibold line-through lg:text-3xl">
              {/* {formatCurrency(offer.property.originalNightlyPrice)} */}$
              {offer.originalPrice}
            </p>
            <p className="text-sm tracking-tight">Airbnb price</p>
          </div>
          <div className="text-center text-secondary-foreground/50">
            <p className="text-2xl font-semibold text-primary lg:text-3xl">
              {/* {formatCurrency(offer.totalPrice)} */}${offer.tramonaPrice}
            </p>
            <p className="text-sm tracking-tight">Our price</p>
          </div>
          <div className="bg-primary px-4 py-2 text-zinc-50 lg:px-5 lg:py-3">
            <p className="text-lg font-semibold lg:text-xl">
              {/* {getDiscountPercentage(
                offer.property.originalNightlyPrice,
                offer.totalPrice,
              )} */}
              {getDiscountPercentage(offer.originalPrice, offer.tramonaPrice)}%
              OFF
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
