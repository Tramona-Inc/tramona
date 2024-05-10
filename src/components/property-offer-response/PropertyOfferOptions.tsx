import { formatCurrency } from "@/utils/utils";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { PropertyAcceptDialog } from "./PropertyAcceptDialog";
import { PropertyCounterDialog } from "./PropertyCounterDialog";
import PropertyDeclineDialog from "./PropertyDeclineDialog";

export default function PropertyCounterOptions({
  offerId,
  originalNightlyBiddingOffer,
  counterNightlyPrice,
  previousOfferNightlyPrice,
  totalCounterAmount,
}: {
  offerId: number;
  originalNightlyBiddingOffer: number;
  counterNightlyPrice: number;
  previousOfferNightlyPrice: number;
  totalCounterAmount: number;
}) {
  const [acceptOpen, setAcceptOpen] = useState(false);
  const [counterOpen, setCounterOpen] = useState(false);
  const [declineOpen, setDeclineOpen] = useState(false);

  const { data: session } = useSession();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col">
        {previousOfferNightlyPrice !== 0 && (
          <p className="text-xs">
            <span className="font-bold">Your Previous offer: </span>
            {formatCurrency(previousOfferNightlyPrice)}/night
          </p>
        )}
        {counterNightlyPrice !== 0 && (
          <div>
            <p className="rounded-sm text-xs">
              <span className="font-bold">
                {session?.user.role === "guest" ? "Host" : "Traveller"} Counter
                offer:{" "}
              </span>
              {formatCurrency(counterNightlyPrice)}/night
            </p>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <PropertyAcceptDialog
          offerId={offerId}
          open={acceptOpen}
          setOpen={setAcceptOpen}
          counterNightlyPrice={counterNightlyPrice}
          totalCounterAmount={totalCounterAmount}
          previousOfferNightlyPrice={previousOfferNightlyPrice}
          originalNightlyBiddingOffer={originalNightlyBiddingOffer}
        />
        <PropertyCounterDialog
          offerId={offerId}
          open={counterOpen}
          setOpen={setCounterOpen}
          counterNightlyPrice={counterNightlyPrice}
          previousOfferNightlyPrice={previousOfferNightlyPrice}
          originalNightlyBiddingOffer={originalNightlyBiddingOffer}
        />
        <PropertyDeclineDialog
          offerId={offerId}
          open={declineOpen}
          onOpenChange={setDeclineOpen}
        />
      </div>
    </div>
  );
}
