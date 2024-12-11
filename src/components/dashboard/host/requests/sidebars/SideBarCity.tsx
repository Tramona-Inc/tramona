import Link from "next/link";
import { useEffect, useState } from "react";
import { plural } from "@/utils/utils";
import { separateByPriceRestriction } from "@/utils/utils";
import EmptyRequestState from "./EmptyRequestState";
import SidebarPropertySkeleton from "./SidebarPropertySkeleton";
import { range } from "lodash";
import { type SeparatedData, type RequestsPageOfferData } from "@/server/server-utils";

interface SidebarCityProps {
  selectedOption: "normal" | "outsidePriceRestriction" | "sent";
  separatedData: SeparatedData | null;
  offerData: RequestsPageOfferData | null;
  isLoading: boolean;
  initialSelectedCity?: string;
}

export default function SidebarCity({
  selectedOption,
  separatedData,
  offerData,
  isLoading,
  initialSelectedCity,
}: SidebarCityProps) {
  const [selectedCity, setSelectedCity] = useState<string | null>(initialSelectedCity ?? null);
  const [selectedCityOffers, setSelectedCityOffers] = useState<string | null>(null);

  useEffect(() => {
    setSelectedCity(initialSelectedCity ?? null);
  }, [initialSelectedCity]);

  const displayedData = separatedData && selectedOption !== "sent"
    ? separatedData[selectedOption]
    : offerData && selectedOption === "sent"
      ? Object.values(offerData[selectedOption] || {})
      : [];

  const handleCityOffersClick = (city: string) => {
    setSelectedCityOffers(city);
    setSelectedCity(null);
  };

  const handleCityClick = (city: string) => {
    setSelectedCityOffers(null);
    setSelectedCity(city);
  };

  if (isLoading) {
    return (
      <div className="pt-4">
        {range(7).map((i) => (
          <SidebarPropertySkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!displayedData || displayedData.length === 0) {
    return <EmptyRequestState />;
  }

  if (selectedOption === "sent") {
    return (
      <div className="pt-4">
        {displayedData.map((cityData, index) => {
          const href = `/host/requests/${cityData.city}?tabs=city&offers=true`;
          const isSelected = selectedCityOffers === cityData.city;
          return (
            <Link href={{ pathname: href, query: {} as Record<string, string> }} className="block" key={index} shallow={true}>
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
        const href = selectedOption === "normal"
          ? `/host/requests/${cityData.city}?tabs=city`
          : `/host/requests/${cityData.city}?tabs=city&priceRestriction=true`;

        const isSelected = selectedCity === cityData.city;
        return (
          <Link href={href} className="block" key={index} shallow={true}>
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
}