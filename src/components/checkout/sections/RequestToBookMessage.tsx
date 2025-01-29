import React from "react";
import UserAvatar from "@/components/_common/UserAvatar";
import { formatDateMonthDayYear } from "../../../utils/utils";
import { UnifiedCheckoutData } from "../types";

function RequestToBookMessage({
  unifiedCheckoutData,
}: {
  unifiedCheckoutData: UnifiedCheckoutData;
}) {
  return (
    <div className="mt-4 border-t pb-6 pt-6">
      <h3 className="text-lg font-semibold">Write a message to the host</h3>
      <h4 className="text-sm font-semibold text-muted-foreground">
        Before you can continue, let{" "}
        {unifiedCheckoutData.property.hostTeam.owner.firstName} know a little
        about your trip and why their place is a good fit
      </h4>
      <div className="mt-3 flex items-center gap-2">
        <div className="relative h-10 w-10 overflow-hidden rounded-full">
          <UserAvatar
            name={unifiedCheckoutData.property.hostTeam.name}
            image={unifiedCheckoutData.property.hostTeam.owner.image}
            email={unifiedCheckoutData.property.hostTeam.owner.email}
          />
        </div>
        <div>
          <p className="font-semibold">
            {unifiedCheckoutData.property.hostTeam.name}
          </p>{" "}
          {/* Replace with actual host name */}
          <p className="text-sm text-muted-foreground">
            Joined:{" "}
            {formatDateMonthDayYear(
              unifiedCheckoutData.property.hostTeam.createdAt,
            )}
          </p>
        </div>
      </div>
      <textarea
        className="mt-3 w-full rounded-md border border-gray-600 p-2"
        placeholder="Enter additional notes here"
        rows={3}
      />
    </div>
  );
}

export default RequestToBookMessage;
