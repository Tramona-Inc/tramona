import React from "react";
import { UnifiedCheckoutData } from "../types";
import { formatDateMonthDay, plural } from "@/utils/utils";

function TripDetails({
  unifiedCheckoutData,
}: {
  unifiedCheckoutData: UnifiedCheckoutData;
}) {
  return (
    <div className="space-y-2 md:my-8">
      <h2 className="text-lg font-semibold">Your trip details</h2>
      <div className="text-sm">
        <p>Dates</p>
        <p className="font-bold">
          {formatDateMonthDay(unifiedCheckoutData.dates.checkIn)} -{" "}
          {formatDateMonthDay(unifiedCheckoutData.dates.checkOut)}
        </p>
      </div>
      <div className="text-sm">
        <p>Guests</p>
        <p className="font-bold">
          {plural(unifiedCheckoutData.guests ?? 0, "guest")}
        </p>
      </div>
    </div>
  );
}

export default TripDetails;
