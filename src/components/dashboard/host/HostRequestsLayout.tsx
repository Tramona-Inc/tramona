import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateFooter,
  EmptyStateTitle,
} from "@/components/ui/empty-state";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SkeletonText } from "@/components/ui/skeleton";
import { api } from "@/utils/api";
import { range } from "lodash";
import { HandshakeIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { type SeparatedData } from "@/server/server-utils";
import { separateByPriceRestriction, plural } from "@/utils/utils";
import { useRouter } from "next/router";
import { type HostRequestsPageData } from "@/server/api/routers/propertiesRouter";

export default function HostRequestsLayout({
  children,
}: React.PropsWithChildren) {
  const [separatedData, setSeparatedData] = useState<SeparatedData | null>(
    null,
  );
  const [selectedOption, setSelectedOption] = useState<
    "normal" | "outsidePriceRestriction"
  >("normal");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"city" | "book">("city");
  const router = useRouter();

  const { data: fetchedProperties, isLoading } =
    api.properties.getHostPropertiesWithRequests.useQuery(undefined, {
      onSuccess: (fetchedProperties) => {
        const separatedProperties =
          separateByPriceRestriction(fetchedProperties);
        setSeparatedData(separatedProperties);
        setIsDataLoading(false);
      },
    });

  useEffect(() => {
    if (isLoading) {
      setIsDataLoading(true);
    }
  }, [isLoading]);

  const displayedData = separatedData ? separatedData[selectedOption] : [];

  return (
    <div className="flex bg-white">
      <div className="sticky top-20 h-screen-minus-header-n-footer w-full overflow-auto border-r px-4 py-8 xl:w-96">
        <ScrollArea>
          <div className="pb-4">
            <h1 className="text-3xl font-bold">Requests</h1>

            {/* Tab Navigation */}
            <div className="mt-6 border-b">
              <div className="flex w-full">
                <button
                  onClick={() => setActiveTab("city")}
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
                  onClick={() => setActiveTab("book")}
                  className={`text-md relative flex-1 pb-4 font-medium transition-colors ${
                    activeTab === "book"
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Requests to book
                  {activeTab === "book" && (
                    <span className="absolute bottom-0 left-0 right-0 h-1 bg-primaryGreen" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="pt-4">
            {isDataLoading ? (
              range(10).map((i) => <SidebarPropertySkeleton key={i} />)
            ) : displayedData.length > 0 ? (
              displayedData.map((cityData) => (
                <SidebarCity
                  key={cityData.city}
                  cityData={cityData}
                  selectedOption={selectedOption}
                  selectedCity={selectedCity}
                  setSelectedCity={setSelectedCity}
                />
              ))
            ) : (
              <EmptyState
                icon={HandshakeIcon}
                className="h-[calc(100vh-280px)]"
              >
                <EmptyStateTitle>No requests yet</EmptyStateTitle>
                <EmptyStateDescription>
                  Properties with requests will show up here
                </EmptyStateDescription>
                <EmptyStateFooter>
                  <Button asChild variant="outline">
                    <Link href="/host/properties">View all properties</Link>
                  </Button>
                </EmptyStateFooter>
              </EmptyState>
            )}
          </div>
        </ScrollArea>
      </div>
      <div className="hidden flex-1 bg-[#fafafa] xl:block">
        {children ? (
          <div className="pb-30 px-4 pt-8">
            <div className="mx-auto max-w-5xl">
              <div className="mb-4 flex flex-row gap-2">
                <Button
                  variant={
                    activeTab === "city" && selectedOption === "normal"
                      ? "primary"
                      : "white"
                  }
                  className="rounded-full shadow-md"
                  onClick={() => {
                    setSelectedOption("normal");
                    setActiveTab("city");
                  }}
                >
                  City Request
                </Button>
                <Button
                  variant={
                    activeTab === "book" ||
                    selectedOption === "outsidePriceRestriction"
                      ? "primary"
                      : "white"
                  }
                  className="rounded-full shadow-md"
                  onClick={() => {
                    setSelectedOption("outsidePriceRestriction");
                    setActiveTab("book");
                  }}
                >
                  Request to Book
                </Button>
              </div>
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

function SidebarCity({
  cityData,
  selectedOption,
  selectedCity,
  setSelectedCity,
}: {
  cityData: HostRequestsPageData;
  selectedOption: "normal" | "outsidePriceRestriction";
  selectedCity: string | null;
  setSelectedCity: (city: string) => void;
}) {
  const href =
    selectedOption === "normal"
      ? `/host/requests/${cityData.city}`
      : `/host/requests/${cityData.city}?priceRestriction=true`;

  const isSelected = selectedCity === cityData.city;

  return (
    <Link href={href} className="block">
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
}

function SidebarPropertySkeleton() {
  return (
    <div className="flex gap-2 p-2">
      <div className="h-16 w-16 rounded-md bg-accent" />
      <div className="flex-1 text-sm">
        <SkeletonText />
        <SkeletonText className="w-2/3" />
        <Badge size="sm" variant="skeleton" className="w-20" />
      </div>
    </div>
  );
}
