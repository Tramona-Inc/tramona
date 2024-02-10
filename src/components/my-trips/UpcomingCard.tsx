import Image from "next/image";
import UserAvatar from "../_common/UserAvatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

type UpcomingCardProps = {
  name: string;
  hostName: string;
  hostImage: string;
  date: string;
  address: string;
  propertyImage: string;
};

export default function UpcomingCard(props: UpcomingCardProps) {
  return (
    <div className="border-2xl flex flex-col-reverse rounded-lg border shadow-xl md:flex-row">
      <div className="flex flex-col gap-2 p-8 font-bold md:w-1/2">
        <p className="text-lg">Tropical getaway in Mexico</p>
        <div className="flex flex-row items-center gap-2">
          <UserAvatar
            name={props.hostName}
            email={""}
            image={props.hostImage}
          />
          <p className="text-xs">Hosted by {props.hostName}</p>
        </div>

        <Separator />

        <p>{props.date}</p>
        <p>{props.address}</p>

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

      <div className="relative w-full max-md:h-[300px] md:w-1/2">
        <Image
          src={props.propertyImage}
          alt=""
          className="absolute max-md:rounded-t-lg md:rounded-r-lg"
          fill
          objectFit="cover"
        />
      </div>
    </div>
  );
}
