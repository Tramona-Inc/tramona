import type { Property } from "@/server/db/schema";
import React from "react";
import { formatCurrency, getNumNights } from "@/utils/utils";
import { useGetOriginalPropertyPricing } from "@/utils/payment-utils/useGetOriginalPropertyPricing";
import { useRouter } from "next/router";
import { Skeleton } from "../ui/skeleton";

function HospitablePricingText({ property }: { property: Property }) {
  const isHospitable = property.originalListingPlatform === "Hospitable";

  const { query } = useRouter();

  const checkIn = new Date(query.checkIn as string);
  const checkOut = new Date(query.checkOut as string);
  const numGuests = parseInt(query.numGuests as string);

  const propertyPricing = useGetOriginalPropertyPricing({
    property: property,
    checkIn: checkIn,
    checkOut: checkOut,
    numGuests: numGuests,
  });

  const numOfNights = getNumNights(checkIn, checkOut);
  return (
    <div className="flex justify-between">
      {propertyPricing.isLoading ? (
        <div className="flex flex-row gap-x-2 text-sm font-semibold">
          <Skeleton className="mt-2 h-3 w-16" />{" "}
          <Skeleton className="mt-2 h-3 w-10" />{" "}
        </div>
      ) : propertyPricing.travelerCalculatedAmountWithSecondaryLayerWithoutTaxes ? (
        <div className="flex items-center space-x-3 text-sm font-semibold">
          {propertyPricing.amountSaved && propertyPricing.amountSaved > 0 ? (
            <>
              <div>
                {formatCurrency(
                  propertyPricing.travelerCalculatedAmountWithSecondaryLayerWithoutTaxes /
                    numOfNights,
                )}{" "}
                night
              </div>
              <div className="text-xs text-zinc-500 line-through">
                airbnb{" "}
                {formatCurrency(
                  propertyPricing.travelerCalculatedAmountWithSecondaryLayerWithoutTaxes /
                    numOfNights +
                    propertyPricing.amountSaved,
                )}
              </div>
            </>
          ) : (
            <div>
              {formatCurrency(
                propertyPricing.travelerCalculatedAmountWithSecondaryLayerWithoutTaxes /
                  numOfNights,
              )}{" "}
              night
            </div>
          )}
        </div>
      ) : (
        <div className="text-sm font-semibold">Pricing unavailable</div>
      )}
    </div>
  );
}

export default HospitablePricingText;
