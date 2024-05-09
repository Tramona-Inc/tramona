import { formatCurrency } from "@/utils/utils";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { PropertyAcceptDialog } from "./PropertyAcceptDialog";
import { PropertyCounterDialog } from "./PropertyCounterDialog";
import PropertyDeclineDialog from "./PropertyDeclineDialog";

export default function PropertyCounterOptions({
  offerId,
  counterNightlyPrice,
  previousOfferNightlyPrice,
  totalCounterAmount,
}: {
  offerId: number;
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
      <div className="mt-5 flex flex-row justify-between">
        {counterNightlyPrice !== 0 && (
          <h1>
            {session?.user.role === "guest" ? "Host" : "Traveller"} Counter
            Offer: {formatCurrency(counterNightlyPrice)} /night
          </h1>
        )}
        {previousOfferNightlyPrice !== 0 && (
          <h1>
            Your offer: {formatCurrency(previousOfferNightlyPrice)} /night
          </h1>
        )}
      </div>
      <div className="flex gap-2">
        <PropertyAcceptDialog
          offerId={offerId}
          open={acceptOpen}
          setOpen={setAcceptOpen}
          counterNightlyPrice={counterNightlyPrice}
          totalCounterAmount={totalCounterAmount}
        />
        <PropertyCounterDialog
          offerId={offerId}
          open={counterOpen}
          setOpen={setCounterOpen}
          counterNightlyPrice={counterNightlyPrice}
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
