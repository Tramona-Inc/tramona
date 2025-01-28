import Link from "next/link";
import { useEffect, useState } from "react";
import { plural } from "@/utils/utils";
import { separateByPriceAndAgeRestriction } from "@/utils/utils";
import EmptyRequestState from "./EmptyRequestState";
import SidebarPropertySkeleton from "./SidebarPropertySkeleton";
import { range } from "lodash";
import {
  type SeparatedData,
  type RequestsPageOfferData,
} from "@/server/server-utils";
import { useRouter } from "next/router";

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
  const [selectedCity, setSelectedCity] = useState<string | null>(
    initialSelectedCity ?? null,
  );
  const [selectedCityOffers, setSelectedCityOffers] = useState<string | null>(
    null,
  );
  const router = useRouter();
  const { query } = router;
  const { tabs, offers, city } = query;

  useEffect(() => {
    setSelectedCity(initialSelectedCity ?? null);
  }, [initialSelectedCity]);

  const displayedData =
    separatedData && selectedOption !== "sent"
      ? separatedData[selectedOption]
      : offerData && selectedOption === "sent"
        ? Object.values(offerData[selectedOption])
        : undefined;

  const handleCityOffersClick = (city: string) => {
    setSelectedCityOffers(city);
    setSelectedCity(null);
  };

  const handleCityClick = (city: string) => {
    setSelectedCityOffers(null);
    setSelectedCity(city);
  };

  if ((isLoading && !offerData) || !displayedData) {
    return (
      <div className="pt-4">
        {range(3).map((i) => (
          <SidebarPropertySkeleton key={i} />
        ))}
      </div>
    );
  }

  if (displayedData.length > 1) {
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
                query: { tabs: "city", option: "sent" },
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
                  ? { tabs: "city", option: "normal" }
                  : { tabs: "city", option: "outsidePriceRestriction" },
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
}
