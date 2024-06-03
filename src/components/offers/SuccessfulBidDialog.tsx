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
}: {
  open: boolean;
  setOpen: (o: boolean) => void;
}) {
  const [acceptedBid, setacceptedBid] = useState<Bid | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const { data: bids } = api.biddings.getMyBids.useQuery();
  const { data: property } = api.properties.getById.useQuery({
    id: acceptedBid?.propertyId ?? 0,
  });
  const { mutateAsync: markDialogSeen } =
    api.biddings.putDialogShown.useMutation();

  useEffect(() => {
    if (bids) {
      const bid = bids.find((bid) => bid.status === "Accepted");
      if (bid && !bid.dialogShown) {
        setacceptedBid(bid);
        setOpen(true);
        void markDialogSeen({ bidId: bid.id });
      }
    }
  }, [bids, markDialogSeen, setOpen]);

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
      <DialogContent ref={dialogRef}>
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-extrabold">You&apos;re Goin&apos;</h1>
          <div className="relative overflow-clip rounded-2xl">
            <div className=" h-64 w-64 sm:h-96 sm:w-96">
              <Image src={property?.imageUrls[0] ?? ""} alt="" fill />
            </div>
            <div className="absolute inset-x-0 bottom-0 flex h-12 items-center justify-center bg-zinc-300 text-center">
              <p className="font-bold text-teal-900">
                {`You saved ${getDiscountPercentage((property?.originalNightlyPrice ?? 0) * AVG_AIRBNB_MARKUP, acceptedBid?.amount ?? 0)}% on this stay`}
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-bold">
            Congrats on placing the winning bid!
          </h3>
          {acceptedBid && (
            <p>{`Your trip to ${property?.address} from ${formatDateMonthDay(acceptedBid.checkIn)} - ${formatDateMonthDay(acceptedBid.checkOut)} is confirmed`}</p>
          )}
          <div className="space-y-1">
            <Link href="/my-trips">
              <Button variant="greenPrimary" className="w-full px-10 sm:w-auto">
                My Trips
              </Button>
            </Link>
            {/* <div className="sm:hidden">
              <Button
                variant="secondary"
                className="w-full font-bold sm:w-auto"
                onClick={handleShare}
              >
                Share with group
              </Button>
            </div> */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
