import Link from "next/link";
import { useEffect, useState, useCallback, useMemo } from "react";
import { plural } from "@/utils/utils";
import EmptyRequestState from "./EmptyRequestState";
import SidebarPropertySkeleton from "./SidebarPropertySkeleton";
import { range } from "lodash";
import { type RequestsPageOfferData } from "@/server/server-utils";
import { useRouter } from "next/router";
import React from "react";
import { useRequests } from "../RequestsContext";

interface SidebarCityProps {
  selectedOption: "normal" | "other" | "sent";
  offerData: RequestsPageOfferData | null;
  initialSelectedCity?: string;
}

const SidebarCity = React.memo(function SidebarCity({
  selectedOption,
  offerData,
  initialSelectedCity,
}: SidebarCityProps) {
  const { separatedData, isLoading } = useRequests();
  const [selectedCity, setSelectedCity] = useState<string | null>(
    initialSelectedCity ?? null,
  );
  const [selectedCityOffers, setSelectedCityOffers] = useState<string | null>(
    null,
  );
  const router = useRouter();
  const { query } = router;
  const { city } = query;

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

  if (!isLoading) {
    return <EmptyRequestState />;
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
