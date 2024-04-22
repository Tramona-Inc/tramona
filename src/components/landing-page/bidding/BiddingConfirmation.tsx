import { Button } from "@/components/ui/button";
import { type Property } from "@/server/db/schema";
import { useBidding } from "@/utils/store/bidding";
import { formatCurrency, formatDateRange } from "@/utils/utils";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Lightbulb } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function BiddingConfirmation({ property }: { property: Property }) {
  const date = useBidding((state) => state.date);

  const resetSession = useBidding((state) => state.resetSession);
  const step = useBidding((state) => state.step);
  const setStep = useBidding((state) => state.setStep);
  const handlePressNext = () => {
    setStep(step - step);
    resetSession();
  };
  return (
    <div className="flex flex-col items-center justify-center ">
      <h1 className=" text-lg font-semibold text-green-600 md:text-3xl">
        {" "}
        Offer Sent!
      </h1>
      <div className="flex flex-col">
        <h1 className="mb-6 font-semibold md:text-lg">
          {/* place bid.amount in here  */}
          Your offer for <span className="font-bold">${100}</span> has been
          submitted!
        </h1>
        <div className="flex flex-col gap-x-10 md:flex-row">
          <div className="-ml-2 flex flex-row items-center space-x-3 rounded-2xl border-2 border-accent px-3 py-2 md:w-full md:space-x-6 md:px-8 md:pr-32">
            <div className="h-[90px] w-[90px] md:h-[200px] md:w-[200px] ">
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
              <h2 className="font-bold ">{property.name}</h2>
              <p className="text-xs md:text-base">
                Airbnb price:{" "}
                {formatCurrency(property?.originalNightlyPrice ?? 0)}/night
              </p>
              <p className="mt-3">Check-in/Check-out:</p>
              <p className="text-muted-foreground">
                {formatDateRange(date.from, date.to)}
              </p>
              <ul className="my-4 flex flex-row text-nowrap text-xs tracking-tighter text-muted-foreground md:space-x-1 ">
                <li className="">{property.maxNumGuests} Guests</li>
                <li>&#8226;</li>
                <li>{property.numBedrooms} Bedrooms</li>
                <li>&#8226;</li>
                <li>{property.numBeds} Beds</li>
                <li>&#8226;</li>
                <li>{property.numBathrooms} Baths</li>
              </ul>
            </div>
          </div>
          <div className="texty- mt-12 flex-col items-center justify-center gap-y-3 md:mt-1 ">
            <div className="flex flex-row space-x-1">
              <Lightbulb />
              <h2 className="text-xl font-bold"> Remember</h2>
            </div>
            <p className="ml-6 text-sm md:ml-0">
              All offers are binding, if your offer is accepted your card will
              be charged.
            </p>
            <div className="mt-16 text-center text-xs md:mt-8">
              <span className="text-blue-500 underline">Learn more </span>about
              the host cancellation policy
            </div>
          </div>
        </div>
      </div>
      <Button
        asChild
        variant="default"
        className="mt-40 md:px-10 md:text-xl"
        onClick={resetSession}
      >
        <Link href={`/requests`}>See my Offers</Link>
      </Button>
    </div>
  );
}

export default BiddingConfirmation;
