import { formatCurrency } from "@/utils/utils";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "../ui/button";
import { PropertyCounterDialog } from "./PropertyCounterDialog";
import PropertyDeclineDialog from './PropertyDeclineDialog';

export default function PropertyCounterOptions({
  offerId,
  counterNightlyPrice,
  previousOfferNightlyPrice,
}: {
  offerId: number;
  counterNightlyPrice: number;
  previousOfferNightlyPrice: number;
}) {
  const [counterOpen, setCounterOpen] = useState(false);
  const [declineOpen, setDeclineOpen] = useState(false);

  const { data: session } = useSession();

  return (
    <div>
      <div className="flex flex-row justify-between">
        {counterNightlyPrice !== 0 && (
          <h1>
            {session?.user.role === "admin" || session?.user.role === "host"
              ? "Traveller"
              : "Host"}{" "}
            Counter Offer: {formatCurrency(counterNightlyPrice)} /night
          </h1>
        )}
        {previousOfferNightlyPrice !== 0 && (
          <h1>
            Your offer: {formatCurrency(previousOfferNightlyPrice)} /night
          </h1>
        )}
      </div>
      <div className="flex gap-2">
        <Button>Accept</Button>
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
