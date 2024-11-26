import { api } from "@/utils/api";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  RequestsPageOfferData,
  type SeparatedData,
} from "@/server/server-utils";
import {
  separateByPriceRestriction,
  plural,
  formatOfferData,
} from "@/utils/utils";
import { HostRequestsToBookPageData } from "@/server/api/routers/propertiesRouter";
import { range } from "lodash";
import EmptyRequestState from "./EmptyRequestState";
import SidebarPropertySkeleton from "./SidebarPropertySkeleton";

export default function SidebarCity({
  selectedOption,
}: {
  selectedOption: "normal" | "outsidePriceRestriction" | "sent";
}) {
  const [separatedData, setSeparatedData] = useState<SeparatedData | null>(
    null,
  );
  const [offerData, setOfferData] = useState<RequestsPageOfferData | null>(
    null,
  );
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedCityOffers, setSelectedCityOffers] = useState<string | null>(
    null,
  );

  const { data: fetchedProperties, isLoading } =
    api.properties.getHostPropertiesWithRequests.useQuery(undefined, {
      onSuccess: (fetchedProperties) => {
        const separatedProperties =
          separateByPriceRestriction(fetchedProperties);
        setSeparatedData(separatedProperties);
      },
    });

  const { data: fetchedOffers, isLoading: isLoadingOffers } =
    api.offers.getAllHostOffers.useQuery(undefined, {
      onSuccess: (fetchedOffers) => {
        const formattedOfferData = formatOfferData(fetchedOffers);
        setOfferData(formattedOfferData);
      },
    });

  const displayedData =
    separatedData && selectedOption !== "sent"
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

  if (isLoading || isLoadingOffers) {
    return (
      <div className="pt-4">
        {range(7).map((i) => (
          <SidebarPropertySkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!displayedData) {
    return <EmptyRequestState />;
  }

  if (selectedOption === "sent") {
    return (
      <div className="pt-4">
        {displayedData.map((cityData, index) => {
          const href = `/host/requests/${cityData.city}?tabs=city&offers=true`;
          const isSelected = selectedCityOffers === cityData.city;
          return (
            <Link href={href} className="block" key={index}>
              <div
                className={`flex items-center justify-between rounded-xl p-4 ${
                  isSelected ? "bg-primaryGreen text-white" : ""
                } ${cityData.requests.length === 0 ? "opacity-50 hover:opacity-75" : ""}`}
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
              } ${cityData.requests.length === 0 ? "opacity-50 hover:opacity-75" : ""}`}
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
