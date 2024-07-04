import Image from "next/image";
import { Button } from "../ui/button";
import { SkeletonText } from "@/components/ui/skeleton";

import { formatDateRange } from "@/utils/utils";

type Stay = {
  propertyImg: string;
  propertyName: string;
  propertyLocation: string;
  checkIn: Date;
  checkOut: Date;
  nightlyCost: number;
  totalCost: number;
  guests: string[];
};

export default function HostStaysCards(trips: Stay[]) {
  return (
    <div className="mb-36 space-y-6">
      {trips.length > 0 ? ( trips.map((stay, index) => (
        <>
          <div
            className="grid grid-cols-1 items-center gap-4 overflow-hidden rounded-xl border md:grid-cols-7 md:rounded-2xl"
            key={index}
          >
            <div className="h-40 md:h-28">
              <Image
                src={stay.propertyImg}
                alt={stay.propertyName}
                width={200}
                height={200}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="px-4 md:col-span-2 md:px-0">
              <h1 className="text-balance font-bold">{stay.propertyName}</h1>
              <p className="text-muted-foreground">{stay.propertyLocation}</p>
            </div>
            <div className="px-4 md:px-0">
              <p className="font-bold">
                {formatDateRange(stay.checkIn, stay.checkOut)}
              </p>
              <p className=" text-sm text-blue-600">Checks out in 2 days</p>
            </div>
            <div className="px-4 md:px-0">
              <p className="font-bold">${stay.nightlyCost} / night</p>
              <p className="text-muted-foreground">${stay.totalCost} total</p>
            </div>
            <div className="mb-4 px-4 md:mb-0 md:px-0">
              <p>
                <span className="underline">{stay.guests[0]}</span>{" "}
                <span className="text-muted-foreground">
                  + {stay.guests.length - 1}{" "}
                  {stay.guests.length - 1 > 1 ? "guests" : "guest"}
                </span>
              </p>
            </div>
            <div className="mr-4 hidden text-end md:block">
              <Button variant="secondary" className="border-none font-bold">
                Message
              </Button>
            </div>
          </div>
          <Button
            variant="secondary"
            className="w-full border-none font-bold md:hidden"
          >
            Message
          </Button>
        </>
      ))): (
        <>
          <SkeletonText />
        </>
      )}
    </div>
  );
}
