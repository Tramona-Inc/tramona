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
import html2canvas from "html2canvas";

export default function SuccessfulBidDialog({
  open,
  setOpen,
  offer,
}: {
  open: boolean;
  setOpen: (o: boolean) => void;
  offer: any;
}) {

  useEffect(() => {
    console.log('ConfirmationDialog rendered with props:', { open, offer });
  }, [open, offer]);

  if (!offer) return null;
  // const handleShare = async () => {
  //   if (dialogRef.current) {
  //     const canvas = await html2canvas(dialogRef.current, {
  //       ignoreElements: (element) => element.tagName === "BUTTON",
  //     });
  //     const image = canvas.toDataURL("image/png");

  //     const shareData = {
  //       title: "Tramona Bid Win",
  //       text: `We won our bid on Tramona, we're going to ${property?.address}!`,
  //       files: [
  //         new File([await (await fetch(image)).blob()], "dialog.png", {
  //           type: "image/png",
  //         }),
  //       ],
  //     };

  //     try {
  //       await navigator.share(shareData);
  //     } catch (error) {
  //       console.error("Error sharing", error);
  //     }
  //   }
  // };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent>
        <div className="space-y-4 text-center">
          <div className="mt-3 md:mt-9 relative">
            <h1 className="text-9xl font-magazine flex-col font-medium relative z-10">
              <div>You&#8217;re</div> 
              <div className="italic mt-[-1.25rem]">Goin&#8217;</div>
            </h1>
            <div className="flex overflow-hidden rounded-2xl mt-[-2.5rem] justify-center">
              <div className="relative block aspect-square overflow-clip rounded-xl w-64">
                <Image src={ offer?.property?.imageUrls[0] }  // ?? "https://lh3.googleusercontent.com/p/AF1QipPJT4-Ym5fEQ-sOnwe_fc_vLprgF4PPBe1tRqGn=s1360-w1360-h1020"
                  alt="" layout="fill" objectFit="cover"
                />
              </div>
            </div>
          </div>
          <h3 className="text-xl font-bold">
            Congrats on booking your trip!
          </h3>
          {/* <p className="font-medium">Your trip to <span className="font-extrabold">Paris</span> from June 22nd - June 28th is confirmed.</p> */}
          {offer && (
            <p className="font-medium">
              Your trip to <span className="font-extrabold">${offer.request.location}</span> from {`${formatDateMonthDay(offer.checkIn)} - ${formatDateMonthDay(offer.checkOut)} is confirmed.`}
            </p>
          )}
          <div className="md:py-5">
            <Link href="/my-trips">
              <Button variant="greenPrimary" className="w-full px-10 py-6 sm:w-auto rounded-full text-lg">
                Share
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
