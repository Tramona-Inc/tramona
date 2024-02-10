import Image from "next/image";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

type Props = {
  name: string;
  hostName: string;
  hostImage: string;
  propertyAddress: string;
};

export default function UpcomingCard({}) {
  return (
    <div className="border-2xl flex flex-col-reverse rounded-lg border shadow-xl sm:flex-row">
      <div className="flex flex-col gap-2 p-8 font-bold md:w-3/5">
        <p className="text-lg">Tropical getaway in Mexico</p>
        <div className="flex flex-row items-center gap-2">
          <Image
            src="/assets/images/fake-properties/owners/2.png"
            alt=""
            width={30}
            height={30}
          />
          <p className="text-xs">Hosted by Kaiya Culhane</p>
        </div>

        <Separator />

        <p>Nov 6 - 11, 2024</p>
        <p>
          6243 Sand crest Circle <br /> Orlando, Florida <br />
          United States
        </p>

        <Separator />

        <div className="flex flex-row flex-wrap gap-2">
          <Button variant={"outline"} size={"sm"}>
            Message host
          </Button>
          <Button variant={"outline"} size={"sm"}>
            Refund info
          </Button>
          <Button variant={"outline"} size={"sm"}>
            Check in instruction
          </Button>
        </div>
      </div>

      <Image
        src="/assets/images/fake-properties/3.png"
        alt=""
        width={100}
        height={100}
        className="rounded-lg  sm:w-2/5 "
      />
    </div>
  );
}
