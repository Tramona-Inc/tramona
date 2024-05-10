import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { api } from "@/utils/api";
import { formatCurrency } from "@/utils/utils";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

export default function AcceptForm({
  offerId,
  setOpen,
  counterNightlyPrice,
  totalCounterAmount,
  previousOfferNightlyPrice,
  originalNightlyBiddingOffer,
}: {
  offerId: number;
  setOpen: (open: boolean) => void;
  counterNightlyPrice: number;
  totalCounterAmount: number;
  previousOfferNightlyPrice: number;
  originalNightlyBiddingOffer: number;
}) {
  const { mutateAsync } = api.biddings.accept.useMutation();

  async function onSubmit() {
    void mutateAsync({ bidId: offerId, amount: totalCounterAmount });

    setOpen(false);
  }

  const { data: session } = useSession();

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-5">
          <h1 className="">
            <span className="font-bold">Original Bidding offer: </span>
            {formatCurrency(originalNightlyBiddingOffer)}/night
          </h1>

          {previousOfferNightlyPrice > 0 && (
            <h1 className="">
              <span className="font-bold">Your Previous Counter offer: </span>
              {formatCurrency(previousOfferNightlyPrice)}/night
            </h1>
          )}

          {counterNightlyPrice > 0 && (
            <>
              <Separator />
              <h1>
                <span className="font-bold">
                  {session?.user.role === "guest" ? "Host" : "Traveller"}{" "}
                  Counter offer:{" "}
                </span>
                {formatCurrency(counterNightlyPrice)}/night
              </h1>
            </>
          )}
        </div>

        <AlertDialog>
          <AlertDialogTrigger>
            <Button type="submit" className="w-full" variant={"greenPrimary"}>
              Accept Offer
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                You are agreeing to accepting the current bid price.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onSubmit}>
                Accept Offer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
