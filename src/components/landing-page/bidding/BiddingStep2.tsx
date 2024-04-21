import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectLabel,
  SelectValue,
} from "@/components/ui/select";
import { type Property } from "@/server/db/schema";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { SelectGroup, SelectTrigger } from "@radix-ui/react-select";
import Image from "next/image";
import { FaApplePay } from "react-icons/fa";

import { useBidding } from "@/utils/store/bidding";
function BiddingStep2({ property }: { property: Property }) {
  const step = useBidding((state) => state.step);
  const setStep = useBidding((state) => state.setStep);
  const handlePressNext = () => {
    setStep(step + 1);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-5 text-sm md:space-y-1 md:text-xl">
      <h1 className="text-lg font-semibold tracking-tight md:text-3xl">
        Step 2 of 2: Confirm Payment{" "}
      </h1>
      <div className="flex flex-col tracking-tight md:flex-row md:space-x-20">
        <div className="flex-col ">
          <h2 className="mb-2 text-lg font-semibold md:mb-5 md:text-2xl">
            Offer Details
          </h2>
          <div className="-ml-2 flex  flex-row items-center space-x-3 rounded-2xl border-2 border-accent px-3 py-2 md:w-full md:space-x-6 md:px-8 md:pr-80">
            <div className="h-[90px] w-[90px] md:h-[160px] md:w-[160px] ">
              <AspectRatio ratio={1} className="">
                <Image
                  src={property.imageUrls[0]!}
                  fill
                  alt="Property Image"
                  className="rounded-3xl"
                />
              </AspectRatio>
            </div>
            <div className="flex flex-col text-sm tracking-tighter md:text-base md:tracking-tight">
              <h2 className="font-bold ">{property.name}</h2>
              <p className="text-xs md:text-base">
                Airbnb price: ${property.originalNightlyPrice}/night
              </p>
              <p className="mt-3">Check-in/Check-out:</p>
              <p className="text-muted-foreground">Check in - check out</p>
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
          {/* Price Breakdown */}
          <div className="text-base font-semibold">
            <div className="mt-8 flex flex-row justify-between">
              <p>Offer Price: $Biddingamount x numOfNights nights</p>
              <p>$Total </p>
            </div>
            <div className="my-4 flex flex-row justify-between">
              <p>Taxes</p>
              <p>$20</p>
            </div>
            <hr />
            <div className="my-2 flex flex-row justify-between">
              <p>Offer Total</p>
              <p>$Total </p>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-y-4 rounded-xl bg-popover px-4 py-6 md:py-20">
          <Button className="w-full md:px-32 ">
            <FaApplePay size={48} />
          </Button>
          <div className=" mt-5 flex w-11/12 flex-row text-sm text-accent">
            <div className="mt-2 w-full border-t-2 border-accent" />
            <span className="mx-4 text-nowrap text-muted-foreground">
              Or pay with card
            </span>
            <div className="mt-2 w-full border-t-2 border-accent" />
          </div>
          <div className="grid w-full max-w-sm items-center text-base">
            <Label htmlFor="email" className="mb-2">
              Card Information
            </Label>
            <Input type="email" id="email" placeholder="Email" />
            <div className="mb-10 flex flex-row">
              <Input placeholder="MM / YY" />
              <Input placeholder="123" />
            </div>
            <Label className="mb-2">Country or Region</Label>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="United States">
                  United States
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel></SelectLabel>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Input placeholder="Zip code" />
            <Button
              className="my-6 py-5 text-lg"
              onClick={() => handlePressNext()}
            >
              Send Offer
            </Button>
            <p className="text-xs text-muted-foreground">
              Offers are binding. If your offer is accepted, your card will be
              charged.
            </p>
            <p className="mt-10 text-center text-xs">
              Host cancellation policy{" "}
              <span className="text-blue-500 underline">Learn more</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BiddingStep2;
