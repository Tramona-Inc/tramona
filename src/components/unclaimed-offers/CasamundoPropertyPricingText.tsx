import { AVG_AIRBNB_MARKUP } from "@/utils/constants";
import type { Property } from "@/server/db/schema";
import { formatCurrency, getNumNights } from "@/utils/utils";
import React from "react";
import { useGetOriginalPropertyPricing } from "@/utils/payment-utils/useGetOriginalPropertyPricing";
import { useRouter } from "next/router";

function CasamundoPropertyPricingText({ property }: { property: Property }) {
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
  const isCasamundo = property.originalListingPlatform === "Casamundo";

  const numOfNights = getNumNights(checkIn, checkOut);

  return (
    <div className="flex justify-between">
      {propertyPricing.travelerCalculatedAmountWithSecondaryLayerWithoutTaxes ? (
        <div className="flex items-center space-x-3 text-sm font-semibold">
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
              (propertyPricing.travelerCalculatedAmountWithSecondaryLayerWithoutTaxes *
                AVG_AIRBNB_MARKUP) /
                numOfNights,
            )}
          </div>
        </div>
      ) : (
        <div className="text-sm font-semibold">Pricing Loading...</div>
      )}
    </div>
  );
}

export default CasamundoPropertyPricingText;
