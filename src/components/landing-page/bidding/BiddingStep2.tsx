import React from "react";
import BiddingFooter from "./BiddingFooter";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FaApplePay } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Step2Props = {
  imageUrl: string;
  propertyTitle: string;
  airbnbPrice: number;
};
function BiddingStep2({ imageUrl, propertyTitle, airbnbPrice }: Step2Props) {
  return (
    <div className="flex flex-col items-center justify-center space-y-3 text-sm md:space-y-1 md:text-xl">
      <h1 className="text-xl font-semibold tracking-tight md:text-3xl">
        Step 2 of 2: Confirm Payment{" "}
      </h1>
      <div className="flex flex-col  tracking-tight md:flex-row md:space-x-20">
        <div className="flex-col ">
          <h2 className="text-lg font-semibold md:text-2xl">Offer Details</h2>
          <div className="-ml-2 flex  flex-row items-center space-x-3 rounded-2xl border-2 border-accent px-3 py-2 md:space-x-6 md:px-8">
            <div className="h-[90px] w-[90px] md:h-[210px] md:w-[210px] ">
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
              <ul className="my-4 flex flex-row text-nowrap text-xs tracking-tighter text-muted-foreground md:space-x-2 md:text-base">
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
        </div>

        <div className="flex w-full flex-col items-center bg-popover px-4 py-6">
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
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Card Information</Label>
            <Input type="email" id="email" placeholder="Email" />
            <div className="flex flex-row ">
            <Input/>
            <Input/>
            </div>
          </div>
        </div>
      </div>
      <BiddingFooter />
    </div>
  );
}

export default BiddingStep2;
