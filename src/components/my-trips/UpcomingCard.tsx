import { api } from "@/utils/api";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import UserAvatar from "../_common/UserAvatar";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Separator } from "../ui/separator";

type UpcomingCardProps = {
  name: string;
  offerId: number;
  hostName: string;
  hostImage: string;
  date: string;
  address: string;
  propertyImage: string;
  checkInInfo: string | null;
};

export default function UpcomingCard(props: UpcomingCardProps) {
  const router = useRouter();

  const { mutate } = api.messages.createConversationWithAdmin.useMutation({
    onSuccess: (conversationId) => {
      void router.push(`/messages?conversationId=${conversationId}`);
    },
  });

  function handleConversation() {
    // TODO: only messages admin for now
    mutate();
  }

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
        {props.address !== "" && <p>{props.address}</p>}

        <Separator />

        <div className="flex flex-row flex-wrap gap-2">
          <Button
            variant={"outline"}
            size={"sm"}
            onClick={() => handleConversation()}
          >
            Message host
          </Button>
          <Dialog>
            <DialogTrigger>
              <Button variant={"outline"} size={"sm"}>
                Refund info
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-2xl">Refund info</DialogTitle>
                <p>
                  Do you need a refund? Your first step is to message your Host
                  to make it right. If they can’t fix it, they can offer you a
                  partial refund through the Resolution Center. Here’s how
                  refunds work when things don’t go just as planned.
                </p>
              </DialogHeader>
              <DialogHeader>
                <h1 className={"font-bold"}>How you’ll get your money</h1>
                <p>
                  Need to request a refund before or after a trip or Experience?
                  First, discuss the amount with your Host in the message
                  thread, and if they agree, go to the Resolution Center to
                  request money. If they don’t agree to the amount within 72
                  hours, reach out to us for help mediating. 
                </p>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger>
              <Button variant={"outline"} size={"sm"}>
                Check-in instruction
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Check-in instruction</DialogTitle>
                <DialogDescription>
                  {props.checkInInfo
                    ? props.checkInInfo
                    : "No instructions added by host! Please contact host to make sure."}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Link
        href={`/listings/${props.offerId}`}
        className="relative w-full max-md:h-[300px] md:w-1/2"
      >
        <Image
          src={props.propertyImage}
          alt=""
          className="absolute max-md:rounded-t-lg md:rounded-r-lg"
          fill
          objectFit="cover"
        />
      </Link>
    </div>
  );
}
