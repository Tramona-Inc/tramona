import { RouterOutputs } from "@/utils/api";
import { FlameIcon, InfoIcon } from "lucide-react";
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
              This is an exclusive offer created just for you &ndash; you will
              not be able to find this price anywh`ere else
            </p>
          </div>
        </div>
      )}
      <div className="flex gap-2 rounded-xl border border-blue-300 bg-blue-50 p-3 text-blue-800">
        <InfoIcon className="size-7 shrink-0" />
        <div>
          <p className="text-sm font-bold">Important Notes</p>
          <p className="text-xs">
            These dates could get booked on other platforms for full price. If
            they do, your match will be automatically withdrawn.
            <br />
            <br />
            After 24 hours, this match will become available for the public to
            book.
            <br />
            <br />
            <b>We encourage you to book within 24 hours for best results.</b>
          </p>
        </div>
      </div>
    </div>
  );
}
