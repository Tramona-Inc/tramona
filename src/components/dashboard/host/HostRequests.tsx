import { SkeletonText } from "@/components/ui/skeleton";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import HostRequestDialog from "./HostRequestDialog";
import RequestCard, {
  type HostDashboardRequest,
} from "@/components/requests/RequestCard";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { type Property } from "@/server/db/schema";
import HostConfirmRequestDialog from "./HostConfirmRequestDialog";
import HostFinishRequestDialog from "./HostFinishRequestDialog";
import { ChevronLeft, ArrowUpDown, ChevronDown } from "lucide-react";
import Link from "next/link";
import { type SeparatedData } from "@/server/server-utils";
import { separateByPriceRestriction } from "@/utils/utils";
import { useToast } from "@/components/ui/use-toast";
import { errorToast } from "@/utils/toasts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import HostRequestCalendar from "./HostRequestCalendar";

export default function HostRequests() {
  const { toast } = useToast();
  const [propertyPrices, setPropertyPrices] = useState<Record<number, string>>(
    {},
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const { city, priceRestriction } = router.query;
  const [priceSort, setPriceSort] = useState<"asc" | "desc" | null>(null);
  const [selectedOption, setSelectedOption] = useState<
    "normal" | "outsidePriceRestriction"
  >(priceRestriction ? "outsidePriceRestriction" : "normal");

  const [selectedRequest, setSelectedRequest] =
    useState<HostDashboardRequest | null>(null);
  const [properties, setProperties] = useState<
    (Property & { taxAvailable: boolean })[] | null
  >(null);
  const [step, setStep] = useState(0);

  const [separatedData, setSeparatedData] = useState<SeparatedData | null>(
    null,
  );
  const [selectedProperties, setSelectedProperties] = useState<number[]>([]);

  const { data: unusedReferralDiscounts } =
    api.referralCodes.getAllUnusedHostReferralDiscounts.useQuery(undefined, {
      onSuccess: () => {
        if (unusedReferralDiscounts && unusedReferralDiscounts.length > 0) {
          toast({
            title: "Congratulations! 🎉 ",
            description:
              "Your referral code has been validated, so your next booking will be completely free of service fees. Enjoy the savings!",
            variant: "default",
            duration: 10000,
          });
        }
      },
    });

  const { data: fetchedProperties } =
    api.properties.getHostPropertiesWithRequests.useQuery(undefined, {
      onSuccess: (fetchedProperties) => {
        const separatedProperties =
          separateByPriceRestriction(fetchedProperties);
        setSeparatedData(separatedProperties);
      },
    });

  const requestsWithProperties =
    selectedOption === "normal"
      ? separatedData?.normal
      : separatedData?.outsidePriceRestriction;

  const cityData = requestsWithProperties?.find((p) => p.city === city);

  // Sort requests based on price if sorting is active
  const sortedRequests = cityData?.requests.slice().sort((a, b) => {
    if (!priceSort) return 0;
    const priceA = Number(propertyPrices[a.request.id] || 0);
    const priceB = Number(propertyPrices[b.request.id] || 0);
    return priceSort === "asc" ? priceA - priceB : priceB - priceA;
  });

  const { mutateAsync: rejectRequest } =
    api.requests.rejectRequest.useMutation();

  // Get the selected property data for the calendar
  const selectedProperty = properties?.[0];
  const calendarData = selectedProperty
    ? {
        title: selectedProperty.title,
        details: {
          guests: selectedProperty.maxGuests,
          bedrooms: selectedProperty.bedrooms,
          beds: selectedProperty.beds,
          baths: selectedProperty.bathrooms,
        },
        occupancyText: "30% occupied over the next 3 months", // This should be calculated from actual booking data
      }
    : null;

  // Handle option change
  const handleOptionChange = (option: "normal" | "outsidePriceRestriction") => {
    setSelectedOption(option);
    const newQuery = {
      ...router.query,
      priceRestriction:
        option === "outsidePriceRestriction" ? "true" : undefined,
    };

    if (!newQuery.priceRestriction) {
      delete newQuery.priceRestriction;
    }

    void router.push({
      pathname: router.pathname,
      query: newQuery,
    });
  };

  return (
    <div className="p-4">
      <div className="mb-4 xl:hidden">
        <Link href="/host/requests">
          <ChevronLeft />
        </Link>
      </div>

      {/* Action Buttons */}
      <div className="mb-4 flex flex-row items-center justify-between">
        {/* Primary/Other Toggle */}
        <div className="flex gap-2">
          <Button
            variant={selectedOption === "normal" ? "primary" : "white"}
            className="rounded-full shadow-md"
            onClick={() => handleOptionChange("normal")}
          >
            Primary
          </Button>
          <Button
            variant={
              selectedOption === "outsidePriceRestriction" ? "primary" : "white"
            }
            className="rounded-full shadow-md"
            onClick={() => handleOptionChange("outsidePriceRestriction")}
          >
            Other
          </Button>
        </div>

        {/* Price Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm hover:bg-gray-50"
            >
              <ArrowUpDown className="h-4 w-4" />
              <span className="text-sm font-medium">Sort by price</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              className="flex items-center gap-2"
              onClick={() => setPriceSort("asc")}
            >
              Price: Low to High
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-2"
              onClick={() => setPriceSort("desc")}
            >
              Price: High to Low
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setPriceSort(null)}
              className="text-gray-500"
            >
              Clear sorting
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Calendar */}
      {/* Calendar */}
      <HostRequestCalendar
        title="Beautiful Downtown Apartment"
        details={{
          guests: 4,
          bedrooms: 2,
          beds: 3,
          baths: 2,
        }}
        occupancyText="30% occupied over the next 3 months"
      />

      {cityData ? (
        <div className="mt-4 grid grid-cols-2 gap-4">
          {" "}
          {/* Removed md: breakpoint to keep 2 columns */}
          {(sortedRequests || cityData.requests).map((requestData) => (
            <div key={requestData.request.id}>
              {" "}
              {/* Removed mb-4 since we're using gap */}
              <RequestCard request={requestData.request} type="host">
                <div className="mt-4 grid w-full grid-cols-2 gap-4">
                  <Button
                    className="w-full border-0 bg-gray-100 text-gray-900 hover:bg-gray-200"
                    variant="outline"
                    onClick={async () => {
                      await rejectRequest({ requestId: requestData.request.id })
                        .then(() => {
                          toast({
                            title: "Successfully rejected request",
                          });
                        })
                        .catch(() => errorToast());
                    }}
                  >
                    Reject
                  </Button>
                  <Button
                    className="hover:bg-green-1000 w-full bg-primaryGreen text-white"
                    onClick={() => {
                      setDialogOpen(true);
                      setSelectedRequest(requestData.request);
                      setProperties(requestData.properties);
                    }}
                  >
                    Make an offer
                  </Button>
                </div>
              </RequestCard>
            </div>
          ))}
        </div>
      ) : (
        <SkeletonText>No requests found for {city}</SkeletonText>
      )}

      {/* Dialogs */}
      {step === 0 && properties && selectedRequest && (
        <HostRequestDialog
          propertyPrices={propertyPrices}
          setPropertyPrices={setPropertyPrices}
          open={dialogOpen}
          setOpen={setDialogOpen}
          properties={properties}
          request={selectedRequest}
          setStep={setStep}
          setSelectedProperties={setSelectedProperties}
          selectedProperties={selectedProperties}
        />
      )}
      {step === 1 && properties && selectedRequest && (
        <HostConfirmRequestDialog
          request={selectedRequest}
          properties={properties}
          setStep={setStep}
          propertyPrices={propertyPrices}
          open={dialogOpen}
          setOpen={setDialogOpen}
          setPropertyPrices={setPropertyPrices}
          selectedProperties={selectedProperties}
        />
      )}
      {step === 2 && selectedRequest && (
        <HostFinishRequestDialog
          request={selectedRequest}
          open={dialogOpen}
          setOpen={setDialogOpen}
        />
      )}
    </div>
  );
}
