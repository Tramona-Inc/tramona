import React from "react";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import Image from "next/image";
import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBidding } from "@/utils/store/listingBidding";
import Link from "next/link";
type BiddingConfirmationProps = {
  imageUrl: string;
  propertyTitle: string;
  airbnbPrice: number;
  amount: number;
  numOfNights: number;
};
function BiddingConfirmation({
  imageUrl,
  propertyTitle,
  airbnbPrice,
  amount = 50,
  numOfNights = 3,
}: BiddingConfirmationProps) {
  const resetSession = useBidding((state)=>state.resetSession)
  const step = useBidding((state)=>state.step)
  const setStep = useBidding((state)=>state.setStep)
  const handlePressNext = () =>{
    setStep(step -step)
    resetSession()
  }
  return (
    <div className="flex flex-col items-center justify-center ">
      <h1 className=" text-lg md:text-3xl font-semibold text-green-600"> Offer Sent!</h1>
      <div className="flex flex-col">
        <h1 className="mb-6 font-semibold md:text-lg">
          Your offer for <span className="font-bold">${amount}</span> has been
          submitted!
        </h1>
        <div className="flex flex-col md:flex-row gap-x-10">
          <div className="-ml-2 flex flex-row items-center space-x-3 rounded-2xl border-2 border-accent px-3 py-2 md:w-full md:space-x-6 md:px-8 md:pr-32">
            <div className="h-[90px] w-[90px] md:h-[200px] md:w-[200px] ">
              <AspectRatio ratio={1} className="">
                <Image
                  src={imageUrl}
                  fill
                  alt="Property Image"
                  className="rounded-3xl"
                />
              </AspectRatio>
            </div>
            <div className="flex flex-col text-sm tracking-tight md:text-base md:tracking-tight">
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
          <div className="flex-col justify-center texty- items-center gap-y-3 mt-12 md:mt-1 ">
            <div className="flex flex-row space-x-1">
                <Lightbulb />
              <h2 className="text-xl font-bold">
                {" "}
                Remember
              </h2>
            </div>
            <p className="text-sm ml-6 md:ml-0">
              All offers are binding, if your offer is accepted your card will
              be charged.
            </p>
            <div className="mt-16 md:mt-8 text-xs text-center">
               <span className="text-blue-500 underline">Learn more </span>about the host cancellation policy
            </div>
          </div>
        </div>
      </div>
      <Link href="/requests">
      <Button  variant="default" className="mt-40 md:text-xl md:px-10" onClick={()=>handlePressNext()}>
        See my Offers
        </Button>      
      </Link>

    </div>
  );
}

export default BiddingConfirmation;
