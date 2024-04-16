
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {ArrowRight} from 'lucide-react'
import { Label } from "@/components/ui/label"
import { useBidding } from "@/utils/store/listingBidding";
import { Button } from "@/components/ui/button";
import { Property } from "@/server/db/schema";

function BiddingStep1({
  property 
}: {property:Property}) {
  const step = useBidding((state)=> state.step)
  const setStep = useBidding((state)=> state.setStep)
  function onPressNext(){
    setStep(step + 1)
  }
  return (
    <div className="flex flex-col items-center justify-center relative w-full">
      <h1 className="text-lg md:text-3xl font-semibold tracking-tight">
        Step 1 of 2: Make an offer
      </h1>
      <div className="mt-10 h-56 w-56">
        <AspectRatio
          ratio={1 / 1}
          className="relative flex items-center justify-center"
        >
          <Image
            src={property.imageUrls[0]!}
            alt="Property Photo"
            fill
            className="object-fit rounded-xl"
          />
        </AspectRatio>
      </div>

      <h2 className="mt-2 text-lg font-semibold">{property.name}</h2>
      <p className="my-3 text-sm">Airbnb&apos;s Price: ${property.originalNightlyPrice}/night</p>
      <div className="border-2 border-dashed border-accent px-24 py-2">
        {/* Change this to reccomended price */}
        <p>$100 </p> 
      </div>
      <p className="my-2 text-sm">Recommended Price</p>
      <div className=" flex w-5/6 flex-row text-accent">
        <div className="mt-3 w-full border-t-4 border-accent" />
        <span className="mx-4 text-muted-foreground">or</span>
        <div className="mt-3 w-full border-t-4 border-accent" />
      </div>
      <div>
        <div className="relative w-full my-8">
        <p className="font-semibold mb-2">Name your price</p>
          <Label className="absolute z-20 text-lg mt-1 ml-1">$</Label>
          <Input className="w-[350px]"/>
        </div>
      </div>
      <Button onClick={()=>onPressNext()} className="px-32 mb-1">Review offer</Button>
      <p className=" text-muted-foreground text-xs md:text-sm mb-5">Payment information will be taken in the next step</p>
    {/* we need to create a new end point /properties/properties[id] */}
      <Link href="/properties/[property.Id]" className="font-light flex flex-row text-sm md:text-base items-center">
        <a>View full propery details</a>
        <ArrowRight size={18}/>
      </Link>
    </div>
  );
}

export default BiddingStep1;
