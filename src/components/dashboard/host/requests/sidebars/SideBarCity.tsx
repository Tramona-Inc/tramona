import Link from "next/link";
import { useEffect, useState, useCallback, useMemo } from "react";
import { plural } from "@/utils/utils";
import EmptyRequestState from "./EmptyRequestState";
import SidebarPropertySkeleton from "./SidebarPropertySkeleton";
import { range } from "lodash";
import {
  type SeparatedData,
  type RequestsPageOfferData,
} from "@/server/server-utils";
import { useRouter } from "next/router";
import React from "react";
import OnlyOtherRequestState from "../city/OnlyOtherRequestState";

interface SidebarCityProps {
  selectedOption: "normal" | "other" | "sent";
  separatedData: SeparatedData | null;
  offerData: RequestsPageOfferData | null;
  isLoading: boolean;
  initialSelectedCity?: string;
}

const SidebarCity = React.memo(function SidebarCity({
  selectedOption,
  separatedData,
  offerData,
  isLoading,
  initialSelectedCity,
}: SidebarCityProps) {
  const [selectedCity, setSelectedCity] = useState<string | null>(
    initialSelectedCity ?? null,
  );
  const [selectedCityOffers, setSelectedCityOffers] = useState<string | null>(
    null,
  );
  const router = useRouter();
  const { query } = router;
  const { offers, city } = query;

  useEffect(() => {
    setSelectedCity(initialSelectedCity ?? null);
  }, [initialSelectedCity]);

  const displayedData = useMemo(() => {
    return selectedOption !== "sent"
      ? separatedData?.[selectedOption]
      : offerData && selectedOption === "sent"
        ? Object.values(offerData[selectedOption])
        : undefined;
  }, [separatedData, offerData, selectedOption]);

  const handleCityOffersClick = useCallback((city: string) => {
    setSelectedCityOffers(city);
    setSelectedCity(null);
  }, []);

  const handleCityClick = useCallback((city: string) => {
    setSelectedCityOffers(null);
    setSelectedCity(city);
  }, []);

  if (!displayedData) {
    return (
      <div className="pt-4">
        {range(3).map((i) => (
          <SidebarPropertySkeleton key={i} />
        ))}
      </div>
    );
  }

  const { normal, other } = separatedData ?? { normal: [], other: [] };
  const noNormalRequests = normal.length === 0;
  const hasOtherRequests = other.length > 0;
  const completelyEmpty = noNormalRequests && other.length === 0;

  if (!isLoading) {
    if (completelyEmpty) return <EmptyRequestState />;
    if (noNormalRequests && hasOtherRequests) return <EmptyRequestState />;
  }

  if (selectedOption === "sent") {
    return (
      <div className="pt-4">
        {displayedData.map((cityData, index) => {
          const isSelected = cityData.city === city;
          return (
            <Link
              href={{
                pathname: `/host/requests/${cityData.city}`,
                query: { option: "sent" },
              }}
              className="block"
              key={index}
              shallow={true}
            >
              <div
                className={`flex items-center justify-between rounded-xl p-4 ${
                  isSelected ? "bg-primaryGreen text-white" : ""
                }`}
                onClick={() => handleCityOffersClick(cityData.city)}
              >
                <div>
                  <h3 className="font-medium">{cityData.city}</h3>
                </div>
                <div
                  className={`text-sm ${isSelected ? "text-white" : "text-muted-foreground"}`}
                >
                  {plural(cityData.requests.length, "offer", "offers")}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className="pt-4">
      {displayedData.map((cityData, index) => {
        const isSelected = selectedCity === cityData.city;
        return (
          <Link
            href={{
              pathname: `/host/requests/${cityData.city}`,
              query:
                selectedOption === "normal"
                  ? { option: "normal" }
                  : { option: "other" },
            }}
            className="block"
            key={index}
            shallow={true}
          >
            <div
              className={`flex items-center justify-between rounded-xl p-4 ${
                isSelected ? "bg-primaryGreen text-white" : ""
              }`}
              onClick={() => handleCityClick(cityData.city)}
            >
              <div>
                <h3 className="font-medium">{cityData.city}</h3>
              </div>
              <div
                className={`text-sm ${isSelected ? "text-white" : "text-muted-foreground"}`}
              >
                {plural(cityData.requests.length, "request", "requests")}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
});
export default SidebarCity;
