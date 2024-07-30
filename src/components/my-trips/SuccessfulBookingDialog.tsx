import Image from "next/image";
import { Button } from "../ui/button";
import { DialogContent, Dialog, DialogTrigger } from "../ui/dialog";
import { type Bid } from "@/server/db/schema/tables/bids";
import { api } from "@/utils/api";
import { formatDateMonthDay } from "@/utils/utils";
import Link from "next/link";
import { getDiscountPercentage } from "@/utils/utils";
import { useEffect, useRef, useState } from "react";
import { AVG_AIRBNB_MARKUP } from "@/utils/constants";
import Confetti from "react-confetti";
import { TripCardDetails } from "@/pages/my-trips";
import SharePropertyDialogContent from "../_common/ShareLink/SharePropertyDialogContent";

export default function SuccessfulBidDialog({
  open,
  setOpen,
  booking,
}: {
  open: boolean;
  setOpen: (o: boolean) => void;
  booking: TripCardDetails | null;
}) {
  const [showShareDialog, setShowShareDialog] = useState(false);
  if (!booking) return null;

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent>
        <div className="space-y-4 text-center">
          <div className="relative mt-3 md:mt-9">
            <h1 className="relative z-10 flex-col font-magazine text-9xl font-medium">
              <div>You&#8217;re</div>
              <div className="mt-[-1.25rem] italic">Goin&#8217;</div>
            </h1>
            <div className="mt-[-2.5rem] flex justify-center overflow-hidden rounded-2xl">
              <div className="relative block aspect-square w-64 overflow-clip rounded-xl">
                <Image
                  src={booking.property.imageUrls[0]!}
                  alt=""
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </div>
          </div>
          <h3 className="text-xl font-bold">Congrats on booking your trip!</h3>
          {/* <p className="font-medium">Your trip to <span className="font-extrabold">Paris</span> from June 22nd - June 28th is confirmed.</p> */}
          {
            <p className="font-medium">
              Your trip to{" "}
              <span className="font-extrabold">{booking.property.city}</span>{" "}
              from{" "}
              {`${formatDateMonthDay(booking.checkIn)} - ${formatDateMonthDay(booking.checkOut)} is confirmed.`}
            </p>
          }
          <div className="md:py-5">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="greenPrimary"
                  className="w-full rounded-full px-10 py-6 text-lg sm:w-auto"
                >
                  Share
                </Button>
              </DialogTrigger>
              <DialogContent className="text-xl font-semibold">
                <SharePropertyDialogContent
                  id={booking.property.id}
                  propertyName={booking.property.name}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="z-100 pointer-events-none fixed inset-0">
          <Confetti width={window.innerWidth} recycle={false} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
