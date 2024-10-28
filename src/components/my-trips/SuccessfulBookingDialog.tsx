import Image from "next/image";
import { Button } from "../ui/button";
import { DialogContent, Dialog, DialogTrigger } from "../ui/dialog";
import { formatDateMonthDay } from "@/utils/utils";
import Confetti from "react-confetti";
import SharePropertyDialogContent from "../_common/ShareLink/SharePropertyDialogContent";
import { type RouterOutputs } from "@/utils/api";

type TripCardDetails =
  RouterOutputs["trips"]["getMyTripsPageDetailsByPaymentIntentId"];

export default function SuccessfulBidDialog({
  open,
  setOpen,
  booking,
}: {
  open: boolean;
  setOpen?: (o: boolean) => void;
  booking: TripCardDetails;
}) {
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
                  src={booking.trip.property.imageUrls[0]!}
                  alt=""
                  fill
                  className="object-cover object-center"
                />
              </div>
            </div>
          </div>
          <h3 className="text-xl font-bold">
            Congratulations on booking your trip!
          </h3>
          {/* <p className="font-medium">Your trip to <span className="font-extrabold">Paris</span> from June 22nd - June 28th is confirmed.</p> */}
          {
            <p className="font-medium">
              Your trip to{" "}
              <span className="font-extrabold">
                {booking.trip.property.city}
              </span>{" "}
              from{" "}
              {`${formatDateMonthDay(booking.trip.checkIn)} - ${formatDateMonthDay(booking.trip.checkOut)} is confirmed.`}
            </p>
          }
          <div className="md:py-5">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full rounded-full px-10 py-6 text-lg sm:w-auto">
                  Share
                </Button>
              </DialogTrigger>
              <DialogContent className="text-xl font-semibold">
                <SharePropertyDialogContent
                  id={booking.trip.property.id}
                  propertyName={booking.trip.property.name}
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
