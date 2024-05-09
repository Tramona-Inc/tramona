import { formatCurrency } from "@/utils/utils";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "../ui/button";
import { TravellerCounterDialog } from "./TravellerCounterDialog";

export default function PropertyCounterOptions({
  offerId,
  counterNightlyPrice,
  userOfferNightlyPrice,
}: {
  offerId: number;
  counterNightlyPrice: number;
  userOfferNightlyPrice: number;
}) {
  const [counterOpen, setCounterOpen] = useState(false);

  const { data: session } = useSession();

  return (
    <div>
      <div className="flex flex-row justify-between">
        <h1>
          {session?.user.role === "admin" || session?.user.role === "host"
            ? "Traveller"
            : "Host"}{" "}
          Counter Offer: {formatCurrency(counterNightlyPrice)} /night
        </h1>
        <h1>Your offer: {formatCurrency(userOfferNightlyPrice)} /night</h1>
      </div>
      <div className="flex gap-2">
        <Button>Accept</Button>
        <TravellerCounterDialog
          offerId={offerId}
          open={counterOpen}
          setOpen={setCounterOpen}
          counterNightlyPrice={counterNightlyPrice}
        />
        <Button variant={"outline"}>Decline</Button>
      </div>
    </div>
  );
}
