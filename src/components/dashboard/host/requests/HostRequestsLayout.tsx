import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import SidebarCity from "./sidebars/SideBarCity";
import SidebarRequestToBook from "./sidebars/SideBarRequestToBook";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangleIcon, ChevronLeft } from "lucide-react";
import { api } from "@/utils/api";
import {
  formatOfferData
} from "@/utils/utils";
import { useHostTeamStore } from "@/utils/store/hostTeamStore";
import useSetInitialHostTeamId from "@/components/_common/CustomHooks/useSetInitialHostTeamId";
import { useIsLg } from "@/utils/utils";
import React from "react";

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
type SelectedOptionType = "normal" | "other" | "sent";

const HostRequestsLayout = React.memo(function HostRequestsLayout({
  isIndex,
  children,
}: {
  isIndex: boolean;
  children: React.ReactNode;
}) {
  useSetInitialHostTeamId();

  const { currentHostTeamId } = useHostTeamStore();
  const router = useRouter();
  const isLg = useIsLg();
  const showSidebar = isLg || isIndex;
  const showChildren = isLg || !isIndex;

  const [activeTab, setActiveTab] = useState<TabType>(
    router.asPath.includes("requests-to-book") ? "property-bids" : "city",
  );
  const [selectedOption, setSelectedOption] =
    useState<SelectedOptionType>("normal");

  // <--------------------Data fetching logic ---------------->
  const { data: separatedData, isLoading: isLoadingProperties } =
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

  console.log(separatedData);

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

  const { data: requestToBookData, isLoading: isLoadingRequestToBook } =
    api.requestsToBook.getAllRequestToBookProperties.useQuery(
      { currentHostTeamId: currentHostTeamId! },
      {
        enabled: !!currentHostTeamId,
      },
    );


  const offerData = useMemo(() => {
    if (offers) {
      return formatOfferData(offers);
    }
    return null;
  }, [offers]);

  const handleTabChange = useCallback(
    (tab: TabType) => {
      if (tab === activeTab) return;
      setActiveTab(tab);
      let newPathname = "/host/requests";

      if (tab === "city") {
        if (separatedData?.normal[0] && isLg) {
          newPathname = `/host/requests/${separatedData.normal[0].city}?option=normal`;
        } else {
          newPathname = `/host/requests`;
        }
      } else {
        newPathname = `/host/requests/requests-to-book`;
      }

      void router.push(newPathname, undefined, { shallow: true });
    },
    [activeTab, router, separatedData, isLg],
  );

  const handleOptionChange = useCallback(
    (option: SelectedOptionType) => {
      if (option === selectedOption) return;
      setSelectedOption(option);

      let newPathname = "/host/requests";
      if (separatedData?.normal[0]) {
        newPathname = `/host/requests/${separatedData.normal[0].city}`;
      }
      void router.push(
        {
          pathname: newPathname,
          query: { option: option },
        },
        undefined,
        { shallow: true },
      );
    },
    [selectedOption, router, separatedData],
  );

  const initialSelectedCity = useMemo(() => {
    return separatedData?.normal[0]?.city
      ? separatedData.normal[0].city
      : undefined;
  }, [separatedData]);

  const initialSelectedPropertyId = useMemo(() => {
    return requestToBookData &&
      requestToBookData.length > 0 &&
      (!isIndex || isLg)
      ? requestToBookData[0]!.id
      : undefined;
  }, [requestToBookData, isIndex, isLg]);

  // <--------------------------------Render------------------>
  return (
    <div className="mx-auto flex">
      {showSidebar && (
        <div className="border-b border-r bg-white">
          <div className="pt-6">
            <h1 className="pl-6 text-3xl font-semibold">Requests</h1>
            <div className="mt-6">
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
          <ScrollArea className="sticky h-screen w-screen overflow-auto border-t px-4 py-8 lg:w-96">
            {activeTab === "city" ?  (
              separatedData && (
                <SidebarCity
                  selectedOption={selectedOption}
                  separatedData={separatedData}
                  offerData={offerData}
                  isLoading={isLoadingProperties}
                  initialSelectedCity={initialSelectedCity}
                />
              )
            ) : (
              <SidebarRequestToBook
                properties={requestToBookData}
                isLoading={isLoadingRequestToBook}
                initialSelectedPropertyId={initialSelectedPropertyId}
              />
            )}
          </ScrollArea>
        </div>
      )}

      {showChildren && (
        <div className="flex-1 bg-[#fafafa] px-4 lg:block">
          <div className="lg:mb-30 mx-auto my-6 mb-24 lg:mt-8">
            <div className="my-6 lg:hidden">
              <Button
                onClick={() =>
                  activeTab === "property-bids"
                    ? void router.push("/host/requests/requests-to-book")
                    : void router.push("/host/requests")
                }
                size="icon"
                variant="ghost"
              >
                <ChevronLeft />
              </Button>
            </div>
            <div className="mx-auto max-w-5xl">
              {activeTab === "city" && (
                <div className="mb-4 flex flex-row justify-between">
                  <div className="flex flex-row gap-x-2">
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
                      selectedOption === "other"
                        ? "primary"
                        : "white"
                    }
                    className="rounded-full shadow-md"
                    onClick={() =>
                      handleOptionChange("other")
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
                          selectedOption === "other"
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
});

export default HostRequestsLayout;
