import { api } from "@/utils/api";
import { formatDateRange } from "@/utils/utils";
import { EllipsisIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import MapPin from "../_icons/MapPin";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { toast } from "../ui/use-toast";

type PropertyOfferCardProps = {
  id: number;
  propertyId: number;
  location: string;
  offerNightlyPrice: number;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  status: boolean;
  propertyName?: string;
  propertyImage: string;
};

export default function PropertyOfferCard({
  offer,
}: {
  offer: PropertyOfferCardProps;
}) {
  const router = useRouter();

  const { mutate } = api.biddings.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "You've withdrawn from your offer",
        description: "Offer is withdrawn",
      });
      void router.push("/");
    },
  });

  function handleWithdraw() {
    mutate({ id: offer.id });
  }

  return (
    <div className="border-2xl flex flex-row rounded-lg border shadow-xl md:flex-row">
      <Link
        href={`/property/${offer.propertyId}`}
        className="relative flex items-center justify-center max-md:ml-5 md:h-[200px] md:w-1/3"
      >
        <Badge
          variant={offer.status ? "green" : "lightGray"}
          className="xs:top-5 absolute left-2 top-7 z-40 md:left-2 md:top-2"
        >
          {offer.status ? "Accepted" : "Pending"}
        </Badge>
        <Image
          alt={offer.propertyImage}
          className="max-md absolute hidden rounded-lg md:block md:rounded-r-none"
          src={offer.propertyImage}
          fill
          objectFit="cover"
        />
        <Image
          alt={offer.propertyImage}
          className="aspect-square rounded-md object-cover"
          src={offer.propertyImage}
          height={200}
          width={200}
        />
      </Link>
      <div className="flex w-full flex-col space-y-3 p-5">
        <div className="flex flex-row justify-between">
          <h1 className="flex flex-row items-center font-bold md:text-xl">
            <MapPin />
            {offer.location}
          </h1>

          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <EllipsisIcon className="mr-2" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-10">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <DialogTrigger>Withdraw</DialogTrigger>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent>
              <div className="flex flex-col items-center justify-center gap-3">
                <h1 className="text-lg font-bold">
                  Are you sure you want to withdraw this offer?
                </h1>
                <p className="text-center text-sm">
                  Your offer will be permanently withdrawn an dyou cannot undo
                  this action.
                </p>
                <div className="flex flex-row gap-4">
                  <Button variant={"secondary"}>Cancel</Button>
                  <Button onClick={handleWithdraw}>Withdraw Offer</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <p>Requested: ${offer.offerNightlyPrice}/night</p>
        <p>{formatDateRange(offer.checkIn, offer.checkOut)}</p>

        <div className="flex flex-row justify-between">
          <p>{offer.guests} Guests</p>

          <div className="hidden flex-row font-semibold md:block">
            <Button variant={"secondary"} className="font-semibold">
              Resend Confirmation
            </Button>
            <Button variant={"underline"} className="font-semibold">
              Update request
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
