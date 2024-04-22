import React from "react";
import BiddingFooter from "./BiddingFooter";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FaApplePay } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectLabel,
  SelectValue,
} from "@/components/ui/select";
import { SelectGroup, SelectTrigger } from "@radix-ui/react-select";

type Step2Props = {
  imageUrl: string;
  propertyTitle: string;
  airbnbPrice: number;
  amount: number;
  numOfNights: number;
};
function BiddingStep2({ imageUrl, propertyTitle, airbnbPrice, amount =50, numOfNights=3 }: Step2Props) {
  return (
    <div className="flex flex-col items-center justify-center space-y-3 text-sm md:space-y-1 md:text-xl">
      <h1 className="text-xl font-semibold tracking-tight md:text-3xl">
        Step 2 of 2: Confirm Payment{" "}
      </h1>
      <div className="flex flex-col  tracking-tight md:flex-row md:space-x-20">
        <div className="flex-col ">
          <h2 className="text-lg font-semibold mb-5 md:text-2xl">Offer Details</h2>
          <div className="-ml-2 flex  flex-row md:w-full items-center space-x-3 rounded-2xl border-2 border-accent px-3 md:pr-80 py-2 md:space-x-6 md:px-8">
            <div className="h-[90px] w-[90px] md:h-[160px] md:w-[160px] ">
              <AspectRatio ratio={1} className="">
                <Image
                  src={imageUrl}
                  fill
                  alt="Property Image"
                  className="rounded-3xl"
                />
              </AspectRatio>
            </div>
            <div className="flex flex-col text-sm tracking-tighter md:text-base md:tracking-tight">
              <h2 className="font-bold ">{propertyTitle}</h2>
              <p className="text-xs md:text-base">
                Airbnb price: ${airbnbPrice}/night
              </p>
              <p className="mt-3">Check-in/Check-out:</p>
              <p className="text-muted-foreground">Check in - check out</p>
              <ul className="my-4 flex flex-row text-nowrap text-xs tracking-tighter text-muted-foreground md:space-x-1 ">
                <li className="">4 Guests</li>
                <li>&#8226;</li>
                <li>2 Bedrooms</li>
                <li>&#8226;</li>
                <li>2 Beds</li>
                <li>&#8226;</li>
                <li>2 Baths</li>
              </ul>
            </div>
          </div>
          {/* Price Breakdown */}
          <div className="text-base font-semibold">
            <div className="flex flex-row justify-between mt-8">
              <p>
                Offer Price: ${amount} x {numOfNights} nights
              </p>
              <p>${amount*numOfNights}</p>
            </div>
            <div className="flex flex-row justify-between my-4">
              <p>
                Taxes
              </p>
              <p>$20</p>
            </div>
            <hr />
            <div className="flex flex-row justify-between my-2">
              <p>
                Offer Total
              </p>
              <p>${amount * numOfNights} </p>
          </div>
        </div>
        </div>

        <div className="flex w-full flex-col items-center bg-popover px-4 py-6 md:py-20 gap-y-4 rounded-xl">
          <Button className="w-full md:px-36 ">
            <FaApplePay size={60} />
          </Button>
          <div className=" mt-5 flex w-11/12 flex-row text-sm text-accent">
            <div className="mt-2 w-full border-t-2 border-accent" />
            <span className="mx-4 text-nowrap text-muted-foreground">
              Or pay with card
            </span>
            <div className="mt-2 w-full border-t-2 border-accent" />
          </div>
          <div className="grid w-full max-w-sm items-center">
            <Label htmlFor="email" className="mb-2">Card Information</Label>
            <Input type="email" id="email" placeholder="Email" />
            <div className="flex flex-row mb-10">
              <Input placeholder="MM / YY" />
              <Input placeholder="123" />
            </div>
            <Label className="mb-2">Country or Region</Label>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="United States">
                  "United States"
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Fruits</SelectLabel>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Input placeholder="Zip code" />
            <Button className="my-6 py-5 text-xl ">Send Offer</Button>
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
