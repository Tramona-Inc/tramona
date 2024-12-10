import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import SidebarCity from "./sidebars/SideBarCity";
import SidebarRequestToBook from "./sidebars/SideBarRequestToBook";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangleIcon } from "lucide-react";
import { api } from "@/utils/api";
import { separateByPriceRestriction, formatOfferData } from "@/utils/utils";
import {
  type SeparatedData,
  type RequestsPageOfferData,
} from "@/server/server-utils";

const alerts = [
  {
    name: "city requests",
    text: "This is where you see requests travelers have made. These have been sent out to all hosts in (name) with an empty night. Accept, deny, or counter offer each request to get the traveler to make a booking. Once a traveler books, your calander will be blocked and all outstanding matches will be withdrawn",
  },
  {
    name: "property bids",
    text: "As soon as a bid is accepted, the booking will instantly go through and will block off your calander. Any outstanding matches will be automatically withdrawn.",
  },
  {
    name: "other",
    text: "In the other tab, you'll find offers to book your property outside the price you specified. If you have a vacancy, we encourage you to review these offers—they might be the perfect fit.",
  },
];

type TabType = "city" | "property-bids";
type SelectedOptionType = "normal" | "outsidePriceRestriction" | "sent";

type RouterQuery = Record<string, string> & {
  tabs?: TabType;
  city?: string;
  propertyId?: string;
  offers?: string;
  priceRestriction?: string;
};

export default function HostRequestsLayout({
  children,
}: React.PropsWithChildren) {
  const router = useRouter();
  const query = router.query as RouterQuery;
  const [activeTab, setActiveTab] = useState<TabType>("city");
  const [selectedOption, setSelectedOption] =
    useState<SelectedOptionType>("normal");

  const [separatedData, setSeparatedData] = useState<SeparatedData | null>(
    null,
  );
  const [offerData, setOfferData] = useState<RequestsPageOfferData | null>(
    null,
  );

  const { data: properties, isLoading: isLoadingProperties } =
    api.properties.getHostPropertiesWithRequests.useQuery(undefined, {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: Infinity,
      cacheTime: Infinity,
      retry: false,
    });

  const { data: offers, isLoading: isLoadingOffers } =
    api.offers.getAllHostOffers.useQuery(undefined, {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: Infinity,
      cacheTime: Infinity,
      retry: false,
    });

  const { data: requestToBookProperties, isLoading: isLoadingRequestToBook } =
    api.requestsToBook.getAllRequestToBookProperties.useQuery(undefined, {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: Infinity,
      cacheTime: Infinity,
      retry: false,
    });

  useEffect(() => {
    if (properties) {
      const separated = separateByPriceRestriction(properties);
      setSeparatedData(separated);
    }
  }, [properties]);

  useEffect(() => {
    if (offers) {
      const formatted = formatOfferData(offers);
      setOfferData(formatted);
    }
  }, [offers]);

  useEffect(() => {
    if (query.tabs) {
      setActiveTab(query.tabs);
    }
  }, [query.tabs]);

  const handleTabChange = useCallback(
    (tab: TabType) => {
      const newQuery: RouterQuery = { ...query, tabs: tab };

      if (
        tab === "property-bids" &&
        !newQuery.propertyId &&
        requestToBookProperties?.[0]
      ) {
        newQuery.propertyId = requestToBookProperties[0].id.toString();
      }

      if (tab === "city" && !newQuery.city && separatedData?.normal[0]) {
        newQuery.city = separatedData.normal[0].city;
      }

      setActiveTab(tab);
      void router.push(
        {
          pathname: "/host/requests",
          query: newQuery as Record<string, string>,
        },
        undefined,
        { shallow: true },
      );
    },
    [query, requestToBookProperties, separatedData, router],
  );

  return (
    <div className="flex bg-white">
      <div className="sticky top-20 h-screen-minus-header-n-footer w-full overflow-auto border-r px-4 py-8 xl:w-96">
        <ScrollArea className="h-1/2">
          <div className="pb-4">
            <h1 className="ml-3 text-3xl font-semibold">Requests</h1>

            <div className="mt-6 border-b">
              <div className="flex w-full">
                <button
                  onClick={() => handleTabChange("city")}
                  className={`text-md relative flex-1 pb-4 font-medium transition-colors ${
                    activeTab === "city"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  City Requests
                  {activeTab === "city" && (
                    <span className="absolute bottom-0 left-0 right-0 h-1 bg-primaryGreen" />
                  )}
                </button>
                <button
                  onClick={() => handleTabChange("property-bids")}
                  className={`text-md relative flex-1 pb-4 font-medium transition-colors ${
                    activeTab === "property-bids"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Property Bids
                  {activeTab === "property-bids" && (
                    <span className="absolute bottom-0 left-0 right-0 h-1 bg-primaryGreen" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {activeTab === "city" ? (
            <SidebarCity
              selectedOption={selectedOption}
              separatedData={separatedData}
              offerData={offerData}
              isLoading={isLoadingProperties || isLoadingOffers}
              initialSelectedCity={query.city}
            />
          ) : (
            <SidebarRequestToBook
              properties={requestToBookProperties}
              isLoading={isLoadingRequestToBook}
              initialSelectedPropertyId={
                query.propertyId ? Number(query.propertyId) : undefined
              }
            />
          )}
        </ScrollArea>
      </div>

      <div className="hidden flex-1 bg-[#fafafa] xl:block">
        {children ? (
          <div className="pb-30 px-4 pt-8">
            <div className="mx-auto max-w-5xl">
              {activeTab === "city" && (
                <div className="mb-4 flex flex-row justify-between">
                  <div className="flex gap-2">
                    <Button
                      variant={
                        selectedOption === "normal" ? "primary" : "white"
                      }
                      className="rounded-full shadow-md"
                      onClick={() => setSelectedOption("normal")}
                    >
                      Primary
                    </Button>
                    <Button
                      variant={selectedOption === "sent" ? "primary" : "white"}
                      className="rounded-full shadow-md"
                      onClick={() => setSelectedOption("sent")}
                    >
                      Sent
                    </Button>
                  </div>
                  <Button
                    variant={
                      selectedOption === "outsidePriceRestriction"
                        ? "primary"
                        : "white"
                    }
                    className="rounded-full shadow-md"
                    onClick={() => setSelectedOption("outsidePriceRestriction")}
                  >
                    Other
                  </Button>
                </div>
              )}
              <Alert className="mb-2">
                <AlertTriangleIcon />
                <AlertTitle>Tip</AlertTitle>
                <AlertDescription>
                  {activeTab === "city" && selectedOption === "normal"
                    ? alerts[0]?.text
                    : activeTab === "property-bids" &&
                        selectedOption === "normal"
                      ? alerts[1]?.text
                      : activeTab === "city" &&
                          selectedOption === "outsidePriceRestriction"
                        ? alerts[2]?.text
                        : ""}
                </AlertDescription>
              </Alert>
              {children}
            </div>
          </div>
        ) : (
          <div className="flex h-[calc(100vh-280px)] flex-col items-center justify-center gap-2">
            <h2 className="text-xl font-semibold">No requests found</h2>
            <p className="text-center text-muted-foreground">
              Consider loosen requirements or allow for more ways to book to see
              more requests.
            </p>
            <Button variant="secondary" className="mt-4">
              Change requirements
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
