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
import { HandshakeIcon, MapPinIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { type SeparatedData } from "@/server/server-utils";
import { separateByPriceRestriction, plural } from "@/utils/utils";
import { useRouter } from "next/router";
import { HostRequestsPageData } from "@/server/api/routers/propertiesRouter";

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
  const [isDataLoading, setIsDataLoading] = useState(true); // New state to track data loading
  const router = useRouter();

  const { data: fetchedProperties, isLoading } =
    api.properties.getHostPropertiesWithRequests.useQuery(undefined, {
      onSuccess: (fetchedProperties) => {
        const separatedProperties =
          separateByPriceRestriction(fetchedProperties);
        setSeparatedData(separatedProperties);
        setIsDataLoading(false); // Set loading state to false when data is fetched
      },
    });

  useEffect(() => {
    if (isLoading) {
      setIsDataLoading(true); // If API starts loading again, mark the data loading as true
    }
  }, [isLoading]);

  const displayedData = separatedData ? separatedData[selectedOption] : [];

  return (
    <div className="flex">
      <div className="sticky top-20 h-screen-minus-header-n-footer w-full overflow-auto border-r px-4 py-8 xl:w-96">
        <ScrollArea>
          <div className="pb-4">
            <h1 className="text-3xl font-bold">Requests</h1>
            <div className="mt-4 flex flex-row gap-2">
              <Button
                variant={
                  selectedOption === "normal"
                    ? "greenPrimary"
                    : "secondaryLight"
                }
                className="rounded-full"
                onClick={() => setSelectedOption("normal")}
              >
                Normal
              </Button>
              {separatedData?.outsidePriceRestriction &&
                separatedData.outsidePriceRestriction.length > 0 && (
                  <Button
                    variant={
                      selectedOption === "outsidePriceRestriction"
                        ? "greenPrimary"
                        : "secondaryLight"
                    }
                    className="rounded-full"
                    onClick={() => setSelectedOption("outsidePriceRestriction")}
                  >
                    Outside Price Restriction
                  </Button>
                )}
            </div>
          </div>
          <div className="pt-4">
            {isDataLoading ? (
              // Show skeletons while loading
              range(10).map((i) => <SidebarPropertySkeleton key={i} />)
            ) : displayedData.length > 0 ? (
              // Show the list of cities if data is available
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
              // Show the empty state only when not loading and no data is available
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
      <div className="hidden flex-1 xl:block">
        {children ? (
          <div className="px-4 pb-32 pt-8">
            <div className="mx-auto max-w-5xl">{children}</div>
          </div>
        ) : (
          <div className="grid h-screen-minus-header flex-1 place-items-center">
            <p className="font-medium text-muted-foreground">
              Select a city to view its requests
            </p>
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
    <Link href={href} className="mb-4 block">
      <div
        className={`flex items-center gap-2 rounded-lg p-4 hover:bg-muted ${
          isSelected ? "bg-muted" : ""
        }`}
        onClick={() => setSelectedCity(cityData.city)}
      >
        <MapPinIcon className="h-8 w-8 text-gray-600" />
        <div className="flex-1">
          <h3 className="font-semibold">{cityData.city}</h3>
          <Badge size="md">{plural(cityData.requests.length, "request")}</Badge>
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
