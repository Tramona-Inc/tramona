import { AVG_AIRBNB_MARKUP } from "@/utils/constants";
import { formatCurrency } from "@/utils/utils";
import React from "react";
import { AirbnbSearchResult } from "../landing-page/search/AdjustedPropertiesContext";

function OtherPropertyPricing({ property }: { property: AirbnbSearchResult }) {
  return (
    <div className="flex items-center space-x-3 text-sm font-semibold">
      <div>
        {"originalNightlyPrice" in property &&
        typeof property.originalNightlyPrice === "number"
          ? formatCurrency(property.originalNightlyPrice)
          : "N/A"}{" "}
        night
      </div>
      <div className="text-xs text-zinc-500 line-through">
        airbnb{" "}
        {"originalNightlyPrice" in property &&
        typeof property.originalNightlyPrice === "number"
          ? formatCurrency(property.originalNightlyPrice * AVG_AIRBNB_MARKUP)
          : "N/A"}
      </div>
    </div>
  );
}

export default OtherPropertyPricing;
