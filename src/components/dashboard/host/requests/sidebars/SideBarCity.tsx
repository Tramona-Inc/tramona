import { api } from "@/utils/api";

import Link from "next/link";
import { useState } from "react";
import { type SeparatedData } from "@/server/server-utils";
import { separateByPriceRestriction } from "@/utils/utils";
import { range } from "lodash";
import EmptyRequestState from "./EmptyRequestState";
import SidebarPropertySkeleton from "./SidebarPropertySkeleton";

// ---------- SIDEBAR CITY COMPONENT ----------

export default function SidebarCity({
  selectedOption,
}: {
  selectedOption: "normal" | "outsidePriceRestriction";
}) {
  // ---------- STATE MANAGEMENT ----------
  const [separatedData, setSeparatedData] = useState<SeparatedData | null>(
    null,
  );

  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // ---------- DATA FETCHING ----------
  const { data: fetchedProperties, isLoading } =
    api.properties.getHostPropertiesWithRequests.useQuery(undefined, {
      onSuccess: (fetchedProperties) => {
        const separatedProperties =
          separateByPriceRestriction(fetchedProperties);
        setSeparatedData(separatedProperties);
      },
    });

  const displayedData = separatedData ? separatedData[selectedOption] : [];

  return (
    <div className="pt-4">
      {isLoading ? (
        // Loading State
        range(7).map((i) => <SidebarPropertySkeleton key={i} />)
      ) : displayedData.length > 0 ? (
        // City List
        displayedData.map((cityData, index) => {
          const href =
            selectedOption === "normal"
              ? `/host/requests/${cityData.city}?tabs=city`
              : `/host/requests/${cityData.city}?tabs=city&priceRestriction=true`;

          const isSelected = selectedCity === cityData.city;

          return (
            <Link href={href} className="block" key={index}>
              <div
                className={`flex items-center justify-between rounded-xl p-4 ${
                  isSelected ? "bg-primaryGreen text-white" : ""
                }`}
                onClick={() => setSelectedCity(cityData.city)}
              >
                <div>
                  <h3 className="font-medium">{cityData.city}</h3>
                </div>
                <div
                  className={`text-sm ${isSelected ? "text-white" : "text-muted-foreground"}`}
                >
                  {cityData.requests.length} requests
                </div>
              </div>
            </Link>
          );
        })
      ) : (
        // Empty State
        <EmptyRequestState />
      )}
    </div>
  );
}
