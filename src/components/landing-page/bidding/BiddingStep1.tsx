import BiddingFooter from "./BiddingFooter";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {ArrowRight} from 'lucide-react'
import { Label } from "@/components/ui/label"
type Step1Props = {
  imageUrl: string;
  propertyTitle: string;
  airbnbPrice: number;
};
function BiddingStep1({
  imageUrl = "https://a0.muscache.com/im/pictures/miso/Hosting-1039233709360808183/original/f6b8ac21-837e-465e-98d5-3755d14c33f1.jpeg?im_w=1200",
  propertyTitle = "Property Title",
  airbnbPrice = 100,
}: Step1Props) {
  return (
    <div className="flex flex-col items-center justify-center relative w-full">
      <h1 className="text-xl md:text-3xl font-semibold tracking-tight">
        Step 1 of 2: Make an offer
      </h1>
      <div className="mt-10 h-56 w-56">
        <AspectRatio
          ratio={1 / 1}
          className="relative flex items-center justify-center"
        >
          <Image
            src={imageUrl}
            alt="Property Photo"
            fill
            className="object-fit rounded-xl"
          />
        </AspectRatio>
      </div>

      <h2 className="mt-2 text-lg font-semibold">{propertyTitle}</h2>
      <p className="my-3 text-sm">Airbnb&apos;s Price: ${airbnbPrice}/night</p>
      <div className="border-2 border-dashed border-accent px-24 py-2">
        <p>$100</p>
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

      <BiddingFooter />
      <Link href="/properties" className="font-light flex flex-row">
        <a>View full propery details</a>
        <ArrowRight/>
      </Link>
    </div>
  );
}

export default BiddingStep1;
