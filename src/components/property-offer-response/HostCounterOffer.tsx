import { formatCurrency } from "@/utils/utils";
import { useSession } from "next-auth/react";

export default function HostCounterOffer({
  counterNightlyPrice,
  previousOfferNightlyPrice,
}: {
  counterNightlyPrice: number;
  previousOfferNightlyPrice: number;
}) {
  const { data: session } = useSession();

  return (
    <div className="">
      {counterNightlyPrice !== 0 && (
        <div>
          <p className="w-fit rounded-sm border border-[#D9D6D1] bg-[#F2F1EF] px-2 py-1 text-sm font-bold">
            <span className="font-bold">
              {session?.user.role === "guest" ? "Host" : "Traveller"} Counter
              offer:{" "}
            </span>
            {formatCurrency(counterNightlyPrice)}/night
          </p>
        </div>
      )}
    </div>
  );
}
