import { Button } from "@/components/ui/button";
import { type Property } from "@/server/db/schema";
import { useBidding } from "@/utils/store/bidding";
import { formatCurrency, formatDateRange, plural } from "@/utils/utils";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Lightbulb } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Confetti from "react-confetti";

function BiddingConfirmation({
  property,
  setOpen,
  price,
}: {
  property: Property;
  setOpen: (open: boolean) => void;
  price: number;
}) {
  const date = useBidding((state) => state.date);
  // const price = useBidding((state) => state.price);

  const resetSession = useBidding((state) => state.resetSession);

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="my-5 text-lg font-semibold text-green-600 md:text-3xl">
        Offer Sent!
      </h1>
      <div className="flex flex-col">
        <h1 className="mb-2 font-semibold md:mb-6 md:text-lg">
          {/* place bid.amount in here  */}
          Your offer for <span className="font-bold">${price}</span> has been
          submitted!
        </h1>
        <div className="flex flex-col gap-x-10 md:flex-row">
          <div className="-ml-2 flex flex-row items-center space-x-3 rounded-2xl border-2 border-accent px-3 py-2 md:w-full md:space-x-6 md:px-8 md:pr-32">
            <div className="h-[90px] w-[90px] md:h-[200px] md:w-[200px]">
              <AspectRatio ratio={1} className="">
                <Image
                  src={property.imageUrls[0]!}
                  fill
                  alt="Property Image"
                  className="rounded-3xl"
                />
              </AspectRatio>
            </div>
            <div className="flex flex-col text-sm tracking-tight md:text-base md:tracking-tight">
              <h2 className="font-bold">{property.name}</h2>
              {property.originalNightlyPrice !== null && (
                <p className="text-xs md:text-base">
                  Airbnb price: {formatCurrency(property.originalNightlyPrice)}
                  /night
                </p>
              )}
              <p className="mt-3">Check-in/Check-out:</p>
              <p className="text-muted-foreground">
                {formatDateRange(date.from, date.to)}
              </p>
              <p className="my-2 text-nowrap text-xs tracking-tighter text-muted-foreground md:my-4 md:text-base">
                {plural(property.maxNumGuests, "guest")} ·{" "}
                {plural(property.numBedrooms, "bedroom")} ·{" "}
                {plural(property.numBeds, "bed")} ·{" "}
                {property.numBathrooms && plural(property.numBathrooms, "bath")}
              </p>
            </div>
          </div>
          <div className="flex-col items-center justify-center gap-y-3 text-sm md:mt-1 md:text-base">
            <p className="mb-6 mt-3 text-center">
              You will hear back within 24 hours!
            </p>
            <div className="flex flex-row space-x-1">
              <Lightbulb />
              <h2 className="text-base font-bold md:text-xl">Remember</h2>
            </div>
            <p className="ml-6 text-xs md:ml-0 md:text-sm">
              All offers are binding, if your offer is accepted your card will
              be charged.
            </p>
            <div className="mt-16 text-center text-xs md:mt-8">
              <Link
                href="/help-center"
                className="text-blue-500 underline-offset-2 hover:underline"
              >
                Learn more
              </Link>{" "}
              about the host cancellation policy
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-row gap-5">
        <Button asChild onClick={resetSession}>
          <Link href={`/requests`}>See my Offers</Link>
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            setOpen(false);
            resetSession();
          }}
        >
          Back to listings
        </Button>
        <div className="z-100 pointer-events-none fixed inset-0">
          <Confetti width={window.innerWidth} recycle={false} />
        </div>
      </div>
    </div>
  );
}

export default BiddingConfirmation;
