import { PropertyType } from "./UnclaimedOfferCards";
import type { Property } from "@/server/db/schema";
import React from "react";
import { formatCurrency } from "@/utils/utils";
import { AVG_AIRBNB_MARKUP } from "@/utils/constants";
import { useGetOriginalPropertyPricing } from "@/utils/payment-utils/useGetOriginalPropertyPricing";
import { useRouter } from "next/router";

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

  return (
    <div className="flex justify-between">
      {propertyPricing.travelerCalculatedAmountWithSecondaryLayerWithoutTaxes ? (
        <div className="flex items-center space-x-3 text-sm font-semibold">
          {propertyPricing.amountSaved && propertyPricing.amountSaved > 0 ? (
            <>
              <div>
                {formatCurrency(
                  propertyPricing.travelerCalculatedAmountWithSecondaryLayerWithoutTaxes,
                )}{" "}
                night
              </div>
              <div className="text-xs text-zinc-500 line-through">
                airbnb{" "}
                {formatCurrency(
                  propertyPricing.travelerCalculatedAmountWithSecondaryLayerWithoutTaxes +
                    propertyPricing.amountSaved,
                )}
              </div>
            </>
          ) : (
            <div>
              {formatCurrency(
                propertyPricing.travelerCalculatedAmountWithSecondaryLayerWithoutTaxes,
              )}{" "}
              night
            </div>
          )}
        </div>
      ) : (
        <div className="text-sm font-semibold">Pricing Loading...</div>
      )}
    </div>
  );
}

export default HospitablePricingText;
