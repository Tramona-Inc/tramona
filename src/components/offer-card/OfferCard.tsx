import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { LiveFeedOffer } from "./data";
import { ArrowRightIcon } from "lucide-react";

type Props = {
  offer: LiveFeedOffer;
};

export default function OfferCard({ offer }: Props) {
  return (
    <div className="flex items-center justify-between rounded-3xl bg-white px-4 py-2 lg:space-x-2 xl:px-6 xl:py-4">
      {/* Avatar and host name */}
      <div className="flex flex-col items-start space-y-1 xl:flex-row xl:items-center xl:space-x-4 xl:space-y-0">
        <Avatar className="size-14 border-2 border-zinc-300 xl:size-16">
          <AvatarImage
            src={offer.hostPicUrl}
            alt="Host avatar"
            className="object-cover"
          />
          <AvatarFallback className="font-medium">
            {offer.hostName
              .split(" ")
              .map((word) => word[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="hidden font-medium text-muted-foreground md:block md:text-sm">
            Hosted by
          </p>
          <p className="text-pretty text-base font-medium tracking-tight text-zinc-950 md:text-lg xl:text-xl">
            {offer.hostName}
          </p>
        </div>
      </div>

      {/* Original price vs Tramona price */}
      <div className="flex space-x-1 font-bold text-zinc-950">
        <div className="flex flex-col text-center text-2xl md:text-3xl">
          <span className="line-through">${offer.originalPrice}</span>{" "}
          <span className="text-sm font-medium text-muted-foreground md:text-base">
            /night
          </span>
        </div>

        <p className="text-3xl">
          <ArrowRightIcon />
        </p>

        <div className="flex flex-col text-center text-2xl md:text-3xl">
          <span className="text-primary">${offer.tramonaPrice}</span>{" "}
          <span className="text-sm font-medium text-muted-foreground md:text-base">
            /night
          </span>
        </div>
      </div>
    </div>
  );
}
