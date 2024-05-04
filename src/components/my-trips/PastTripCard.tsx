import Link from "next/link";

import { Badge } from "../ui/badge";
import UserAvatar from "../_common/UserAvatar";
import { type PastTrip } from "./PastTrips";

export default function PastTripCard({ trip }: { trip: PastTrip }) {
  return (
    <div className="w-full">
      <div className="flex overflow-clip rounded-lg border">
        <div className="relative">
          <Badge
            variant="lightGray"
            className="absolute left-4 top-4 font-bold"
          >
            Past Trip
          </Badge>
          <img
            src={"https://placehold.co/400x400.png"}
            width={400}
            height={400}
          />
        </div>

        <div className="flex w-full flex-col gap-2 px-5 py-3 md:gap-4 md:p-5">
          <div className="space-y-1 md:space-y-2">
            <h2 className="text-lg font-bold md:text-2xl">
              Property Name/Title
            </h2>
            <div className="flex gap-2">
              <UserAvatar name={"Pam"} />
              <div>
                <p className="text-xs text-muted-foreground md:text-sm">
                  Hosted by
                </p>
                <p className="text-sm md:text-base">Pam</p>
              </div>
            </div>
          </div>

          <div className="h-[2px] rounded-full bg-gray-200"></div>

          <div className="space-y-2">
            <h3 className="text-base font-bold md:text-xl">Trip details</h3>
            <p className="text-sm md:text-base">
              Check-in/Check-out: Thu Apr 25 - Tue Apr 30
            </p>
            <Link
              href={`/my-trips/${1}`}
              className="text-sm underline underline-offset-4"
            >
              View more
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
