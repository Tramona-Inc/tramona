import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import SidebarCity from "./sidebars/SideBarCity";
import SidebarRequestToBook from "./sidebars/SideBarRequestToBook";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangleIcon, ChevronLeft } from "lucide-react";
import { api } from "@/utils/api";
import {
  separateByPriceAndAgeRestriction,
  formatOfferData,
} from "@/utils/utils";
import {
  type SeparatedData,
  type RequestsPageOfferData,
} from "@/server/server-utils";
import { useHostTeamStore } from "@/utils/store/hostTeamStore";
import useSetInitialHostTeamId from "@/components/_common/CustomHooks/useSetInitialHostTeamId";
import { useIsLg } from "@/utils/utils";
import Link from "next/link";

const alerts = [
  {
    name: "city requests",
    text: "This is where you see requests travelers have made. These have been sent out to all hosts with an empty night. Accept, deny, or counter offer each request to get the traveler to make a booking. Once a traveler books, your calander will be blocked and all outstanding matches will be withdrawn",
  },
  {
    name: "property bids",
    text: "As soon as a bid is accepted, the booking will instantly go through and will block off your calander. Any outstanding matches will be automatically withdrawn.",
  },
  {
    name: "other",
    text: "In the other tab, you'll find offers to book your property outside the price you specified. If you have a vacancy, we encourage you to review these offers—they might be the perfect fit.",
  },
  {
    name: "sent",
    text: "This is where you see matches you made for travelers requests.",
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
  option?: SelectedOptionType;
};

export default function HostRequestsLayout({
  isIndex,
  children,
}: {
  isIndex: boolean;
  children: React.ReactNode;
}) {
  useSetInitialHostTeamId();
  const { currentHostTeamId } = useHostTeamStore();
  const router = useRouter();

  // Use pathname and searchParams
  // const pathname = usePathname(); - Removed usePathname
  // const searchParams = useSearchParams(); - Removed useSearchParams

  const query = router.query as RouterQuery;

  const [activeTab, setActiveTab] = useState<TabType>(query.tabs ?? "city");
  const [selectedOption, setSelectedOption] = useState<SelectedOptionType>(
    query.option ?? "normal",
  );

  const [separatedData, setSeparatedData] = useState<SeparatedData | null>(
    null,
  );
  const [offerData, setOfferData] = useState<RequestsPageOfferData | null>(
    null,
  );

  const { data: properties, isLoading: isLoadingProperties } =
    api.properties.getHostPropertiesWithRequests.useQuery(
      { currentHostTeamId: currentHostTeamId! },
      {
        enabled: !!currentHostTeamId,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        staleTime: Infinity,
        cacheTime: Infinity,
        retry: false,
      },
    );

  const { data: offers, isLoading: isLoadingOffers } =
    api.offers.getAllHostOffers.useQuery(
      { currentHostTeamId: currentHostTeamId! },
      {
        enabled: !!currentHostTeamId,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        staleTime: Infinity,
        cacheTime: Infinity,
        retry: false,
      },
    );

  const { data: requestToBookProperties, isLoading: isLoadingRequestToBook } =
    api.requestsToBook.getAllRequestToBookProperties.useQuery(
      { currentHostTeamId: currentHostTeamId! },
      {
        enabled: !!currentHostTeamId,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        staleTime: Infinity,
        cacheTime: Infinity,
        retry: false,
      },
    );

  useEffect(() => {
    if (properties) {
      const separated = separateByPriceAndAgeRestriction(properties);
      setSeparatedData(separated);
    }
  }, [properties]);

  useEffect(() => {
    if (offers) {
      const formatted = formatOfferData(offers);
      setOfferData(formatted);
    }
  }, [offers]);

  const handleTabChange = useCallback(
    (tab: TabType) => {
      if (tab === activeTab) return;

      let newQuery: RouterQuery = {
        ...query,
        tabs: tab,
        propertyId: "",
      };
      let newPathname = `/host/requests`;

      if (tab === "city") {
        if (query.city) {
          newPathname = `/host/requests/${query.city}`;
          delete newQuery.propertyId;
        } else if (!newQuery.city && separatedData?.normal[0]) {
          newPathname = `/host/requests/${separatedData.normal[0].city}`;
          delete newQuery.propertyId;
        }
      }

      if (tab === "property-bids") {
        // First, check if there's a property ID available to use
        if (query.propertyId && isLg) {
          newPathname = `/host/requests/requests-to-book/${query.propertyId}`;
          delete newQuery.propertyId;
        } else if (requestToBookProperties?.[0] && isLg) {
          //If a property ID is available, use the first property from requestToBookProperties
          newPathname = `/host/requests/requests-to-book/${requestToBookProperties[0].id}`;
          delete newQuery.propertyId;
        } else {
          // If no property ID is available, don't switch the tab and potentially show an error
          console.error("No property available for property-bids tab.");
          return;
        }
      }

      setActiveTab(tab);
      const url = {
        pathname: newPathname,
        query: newQuery,
      };
      void router.push(url, undefined, { shallow: true });
    },
    [query, requestToBookProperties, separatedData, router, activeTab],
  );
  // <----------------Screen size logic ------------>
  const isLg = useIsLg();
  const showSidebar = isLg || isIndex;
  const showChildren = isLg || !isIndex;

  const handleOptionChange = useCallback(
    (option: SelectedOptionType) => {
      if (option === selectedOption) return;

      setSelectedOption(option);
      let newPathname = `/host/requests`;
      if (query.city) {
        newPathname = `/host/requests/${query.city}`; // Keep city in path
      }
      void router.push(
        {
          pathname: newPathname,
          query: { ...query, option: option },
        },
        undefined,
        { shallow: true },
      );
    },
    [query, router, selectedOption],
  );

  return (
    <div className="flex bg-white">
      {showSidebar && (
        <ScrollArea className="sticky top-20 h-screen-minus-header-n-footer w-screen overflow-auto border-r px-4 py-8 lg:w-96">
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
              isLoading={isLoadingProperties}
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
      )}

      {showChildren && (
        <div className="flex-1 bg-[#fafafa] lg:block">
          <div className="lg:mb-30 my-6 mb-24 px-4 lg:mt-8">
            <div className="my-6 lg:hidden">
              <Link href="/host/requests">
                <ChevronLeft />
              </Link>
            </div>
            <div className="mx-auto max-w-5xl">
              {activeTab === "city" && (
                <div className="mb-4 flex flex-row justify-between">
                  <div className="flex gap-2">
                    <Button
                      variant={
                        selectedOption === "normal" ? "primary" : "white"
                      }
                      className="rounded-full shadow-md"
                      onClick={() => handleOptionChange("normal")}
                    >
                      Primary
                    </Button>
                    <Button
                      variant={selectedOption === "sent" ? "primary" : "white"}
                      className="rounded-full shadow-md"
                      onClick={() => handleOptionChange("sent")}
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
                    onClick={() =>
                      handleOptionChange("outsidePriceRestriction")
                    }
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
                        : alerts[3]?.text}
                </AlertDescription>
              </Alert>
              {children}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
