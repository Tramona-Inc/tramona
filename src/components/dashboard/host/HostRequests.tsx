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
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { type SeparatedData } from "@/server/server-utils";
import { separateByPriceRestriction } from "@/utils/utils";
import { useToast } from "@/components/ui/use-toast";

export default function HostRequests() {
  const { toast } = useToast();
  const [propertyPrices, setPropertyPrices] = useState<Record<number, string>>(
    {},
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const { city, priceRestriction } = router.query;

  const [selectedRequest, setSelectedRequest] =
    useState<HostDashboardRequest | null>(null);
  const [properties, setProperties] = useState<Property[] | null>(null);
  const [step, setStep] = useState(0);

  const [separatedData, setSeparatedData] = useState<SeparatedData | null>(
    null,
  );

  const [selectedProperties, setSelectedProperties] =
    useState<number[]>([]);

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

  api.properties.getHostPropertiesWithRequests.useQuery(undefined, {
    onSuccess: (fetchedProperties) => {
      const separatedProperties = separateByPriceRestriction(fetchedProperties);
      setSeparatedData(separatedProperties);
    },
  });

  const requestsWithProperties = priceRestriction
    ? separatedData?.outsidePriceRestriction
    : separatedData?.normal;

  const cityData = requestsWithProperties?.find((p) => p.city === city);

  const { mutate: rejectRequest } = api.requests.rejectRequest.useMutation();

  return (
    <div className="p-4">
      <div className="mb-4 xl:hidden">
        <Link href="/host/requests">
          <ChevronLeft />
        </Link>
      </div>
      {cityData ? (
        <div className="grid gap-4 md:grid-cols-2">
          {cityData.requests.map((requestData) => (
            <div key={requestData.request.id} className="mb-4">
              <RequestCard request={requestData.request} type="host">
                <Button
                  variant="darkOutline"
                  className="mt-2"
                  onClick={() => {
                    rejectRequest({ requestId: requestData.request.id });
                  }}
                >
                  Reject
                </Button>
                <Button
                  className="mt-2"
                  onClick={() => {
                    setDialogOpen(true);
                    setSelectedRequest(requestData.request);
                    setProperties(requestData.properties);
                  }}
                >
                  Make an offer
                </Button>
              </RequestCard>
            </div>
          ))}
        </div>
      ) : (
        <SkeletonText>No requests found for {city}</SkeletonText>
      )}
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
