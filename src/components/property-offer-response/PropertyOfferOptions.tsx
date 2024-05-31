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
    <div className="flex flex-col gap-2">
      <div className="flex flex-col">
        {/* {counterNightlyPrice !== 0 && (
          <div>
            <p className="w-fit rounded-sm border border-[#D9D6D1] bg-[#F2F1EF] px-2 py-1 text-sm font-bold">
              <span className="font-bold">
                {session?.user.role === "guest" ? "Host" : "Traveller"} Counter
                offer:{" "}
              </span>
              {formatCurrency(counterNightlyPrice)}/night
            </p>
          </div>
        )} */}
        {previousOfferNightlyPrice !== 0 && (
          <p className="px-2 text-xs">
            <span className="font-bold">Your Previous offer: </span>
            {formatCurrency(previousOfferNightlyPrice)}/night
          </p>
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
          counterNightlyPrice={counterNightlyPrice}
          originalNightlyBiddingOffer={originalNightlyBiddingOffer}
        />
      </div>
    </div>
  );
}
