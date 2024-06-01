import Image from "next/image";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { type Bid } from "@/server/db/schema/tables/bids";
import { api } from "@/utils/api";
import { formatDateMonthDay } from "@/utils/utils";
import Link from "next/link";
import { getDiscountPercentage } from "@/utils/utils";

export default function SuccessfulBidDialog({
  open,
  setOpen,
  acceptedBid,
}: {
  open: boolean;
  setOpen: (o: boolean) => void;
  acceptedBid: Bid | null;
}) {
  const { data: property } = api.properties.getById.useQuery({
    id: acceptedBid?.propertyId ?? 0,
  });

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent>
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-extrabold">You&apos;re Goin&apos;</h1>
          <div className="relative overflow-clip rounded-2xl">
            <div className="h-96 w-96">
              <Image src={property?.imageUrls[0] ?? ""} alt="" fill />
            </div>
            <div className="absolute inset-x-0 bottom-0 flex h-12 items-center justify-center bg-zinc-300 text-center">
              <p className="font-bold text-teal-900">
                {`You saved ${getDiscountPercentage(property?.originalNightlyPrice ?? 0, acceptedBid?.amount ?? 0)}% on this stay`}
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-bold">
            Congrats on placing the winning bid!
          </h3>
          {acceptedBid && (
            <p>{`Your trip to ${property?.address} from ${formatDateMonthDay(acceptedBid.checkIn)} - ${formatDateMonthDay(acceptedBid.checkOut)} is confirmed`}</p>
          )}
          <div>
            <Link href="/my-trips">
              <Button variant="greenPrimary" className="px-10">
                My Trips
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
