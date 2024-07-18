import Image from "next/image";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { type Bid } from "@/server/db/schema/tables/bids";
import { api } from "@/utils/api";
import { formatDateMonthDay } from "@/utils/utils";
import Link from "next/link";
import { getDiscountPercentage } from "@/utils/utils";
import { useEffect, useRef, useState } from "react";
import { AVG_AIRBNB_MARKUP } from "@/utils/constants";
import Confetti from "react-confetti";
import exportAsImage from "@/utils/exportAsImage";
import { Trip } from "@/server/db/schema";
import { TripCardDetails } from "@/pages/my-trips";

export default function SuccessfulBidDialog({
  open,
  setOpen,
  booking,
}: {
  open: boolean;
  setOpen: (o: boolean) => void;
  booking: TripCardDetails | null;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  if (!booking) return null;

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent ref={dialogRef}>
        <div className="space-y-4 text-center">
          <div className="mt-3 md:mt-9 relative">
            <h1 className="text-9xl font-magazine flex-col font-medium relative z-10">
              <div>You&#8217;re</div> 
              <div className="italic mt-[-1.25rem]">Goin&#8217;</div>
            </h1>
            <div className="flex overflow-hidden rounded-2xl mt-[-2.5rem] justify-center">
              <div className="relative block aspect-square overflow-clip rounded-xl w-64">
                <Image src={ booking?.property?.imageUrls[0]! }  
                  alt="" layout="fill" objectFit="cover"
                />
              </div>
            </div>
          </div>
          <h3 className="text-xl font-bold">
            Congrats on booking your trip!
          </h3>
          {/* <p className="font-medium">Your trip to <span className="font-extrabold">Paris</span> from June 22nd - June 28th is confirmed.</p> */}
          {booking && (
            <p className="font-medium">
              Your trip to <span className="font-extrabold">{booking.property.city}</span> from {`${formatDateMonthDay(booking.checkIn)} - ${formatDateMonthDay(booking.checkOut)} is confirmed.`}
            </p>
          )}
          <div className="md:py-5">
            <Link href="/my-trips">
              <Button variant="greenPrimary" className="w-full px-10 py-6 sm:w-auto rounded-full text-lg" onClick={() => {if (dialogRef.current) exportAsImage(dialogRef.current, `tramona-booking-${booking.property.city}`)}}>
                Share
              </Button>
            </Link>
          </div>
        </div>

        <div className="z-100 pointer-events-none fixed inset-0">
            <Confetti width={window.innerWidth} recycle={false} />
          </div>
      </DialogContent>
    </Dialog>
  );
}
