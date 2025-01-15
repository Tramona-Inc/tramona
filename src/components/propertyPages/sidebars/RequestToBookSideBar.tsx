import { RouterOutputs } from "@/utils/api";
import { FlameIcon } from "lucide-react";
import RequestToBookOrBookNowPriceCard from "./priceCards/RequestToBookOrBookNowPriceCard";
export type PropertyPageData = RouterOutputs["properties"]["getById"];

export default function RequestToBookPageSidebar({
  property,
}: {
  property: PropertyPageData;
}) {
  return (
    <div className="space-y-4">
      <RequestToBookOrBookNowPriceCard property={property} />

      {!property.bookOnAirbnb && (
        <div className="flex gap-2 rounded-xl border border-orange-300 bg-orange-50 p-3 text-orange-800">
          <FlameIcon className="size-7 shrink-0" />
          <div>
            <p className="text-sm font-bold">Tramona exclusive deal</p>
            <p className="text-xs">
              This is an exclusive Tramona price, you will not be able to see
              this anywhere else.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
