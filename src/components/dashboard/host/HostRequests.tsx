import { SkeletonText } from "@/components/ui/skeleton";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import HostRequestDialog from "./HostRequestDialog";
import RequestCard, {
  type DetailedRequest,
} from "@/components/requests/RequestCard";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { type Property } from "@/server/db/schema";
import HostConfirmRequestDialog from "./HostConfirmRequestDialog";
import HostFinishRequestDialog from "./HostFinishRequestDialog";
export default function HostRequests() {
  const [propertyPrices, setPropertyPrices] = useState<Record<number, string>>(
    {},
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const { city } = router.query;
  const [selectedRequest, setSelectedRequest] =
    useState<DetailedRequest | null>(null);
  const [properties, setProperties] = useState<Property[] | null>(null);
  const [step, setStep] = useState(0);

  const { data: requestsWithProperties } =
    api.properties.getHostPropertiesWithRequests.useQuery();

  const cityData = requestsWithProperties?.find((p) => p.city === city);

  return (
    <div className="p-4">
      {cityData ? (
        <div className="grid gap-4 md:grid-cols-2">
          {cityData.requests.map((requestData) => (
            <div key={requestData.request.id} className="mb-4">
              <RequestCard request={requestData.request} isAdminDashboard>
                <Button variant="darkOutline" className="mt-2">
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
      {step == 0 && (
        <HostRequestDialog
          propertyPrices={propertyPrices}
          setPropertyPrices={setPropertyPrices}
          open={dialogOpen}
          setOpen={setDialogOpen}
          properties={properties}
          request={selectedRequest}
          setStep={setStep}
        />
      )}
      {step == 1 && (
        <HostConfirmRequestDialog
          request={selectedRequest}
          properties={properties}
          setStep={setStep}
          propertyPrices={propertyPrices}
          open={dialogOpen}
          setOpen={setDialogOpen}
          setPropertyPrices={setPropertyPrices}
        />
      )}
      {step == 2 && (
        <HostFinishRequestDialog request={request} open={dialogOpen} setOpen={setDialogOpen} />
      )}
    </div>
  );
}
