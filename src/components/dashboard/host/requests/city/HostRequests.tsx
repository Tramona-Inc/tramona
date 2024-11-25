import { SkeletonText } from "@/components/ui/skeleton";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import HostRequestDialog from "./HostRequestDialog";
import RequestCard, {
  type HostDashboardRequest,
} from "@/components/requests/RequestCard";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Offer, type Property } from "@/server/db/schema";
import HostConfirmRequestDialog from "../../HostConfirmRequestDialog";
import HostFinishRequestDialog from "./HostFinishRequestDialog";
import { AlertCircleIcon, AlertTriangleIcon, ChevronLeft } from "lucide-react";
import Link from "next/link";
import {
  RequestsPageOfferData,
  type SeparatedData,
} from "@/server/server-utils";
import { formatOfferData, separateByPriceRestriction } from "@/utils/utils";
import { useToast } from "@/components/ui/use-toast";
import { errorToast } from "@/utils/toasts";
import { HostRequestsPageOfferData } from "@/server/api/routers/propertiesRouter";
import PastOfferCard from "./PastOfferCard";
import PastOfferWithdrawDialog from "./PastOfferWithdrawDialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function HostRequests() {
  const { toast } = useToast();
  const [propertyPrices, setPropertyPrices] = useState<Record<number, string>>(
    {},
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const { city, priceRestriction, offers } = router.query;

  const [selectedRequest, setSelectedRequest] =
    useState<HostDashboardRequest | null>(null);
  const [properties, setProperties] = useState<
    (Property & { taxAvailable: boolean })[] | null
  >(null);
  const [step, setStep] = useState(0);

  const [separatedData, setSeparatedData] = useState<SeparatedData | null>(
    null,
  );

  const [offerData, setOfferData] = useState<RequestsPageOfferData | null>(
    null,
  );
  const [selectedOffer, setSelectedOffer] =
    useState<number | null>(null);

  const [offerWithdrawalDialogOpen, setOfferWithdrawalDialogOpen] =
    useState(false);

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

  api.properties.getHostPropertiesWithRequests.useQuery(undefined, {
    onSuccess: (fetchedProperties) => {
      const separatedProperties = separateByPriceRestriction(fetchedProperties);
      setSeparatedData(separatedProperties);
    },
  });

  const requestsWithProperties = priceRestriction
    ? separatedData?.outsidePriceRestriction
    : separatedData?.normal;

  const cityRequestsData = requestsWithProperties?.find((p) => p.city === city);

  const { mutateAsync: rejectRequest } =
    api.requests.rejectRequest.useMutation();

  api.offers.getAllHostOffers.useQuery(undefined, {
    onSuccess: (fetchedOffers) => {
      const formattedData = formatOfferData(fetchedOffers);
      setOfferData(formattedData);
    },
  });

  const offersWithProperties = offerData?.sent
    ? Object.values(offerData.sent)
    : [];

  const cityOffersData = offersWithProperties.find((o) => o.city === city);

  return (
    <div className="p-1">
      <div className="mb-4 xl:hidden">
        <Link href="/host/requests">
          <ChevronLeft />
        </Link>
      </div>
      <Alert className="mb-2">
        <AlertTriangleIcon />
        <AlertTitle>Tip</AlertTitle>
        <AlertDescription>
          These is where you see requests travelers have made. These have been
          sent out to all hosts in (name) with an empty night. Accept, deny, or
          counter offer each request to get the traveler to make a booking. Once
          a traveler books, your calander will be blocked and all outstanding
          matches will be withdrawn
        </AlertDescription>
      </Alert>
      {cityRequestsData && !offers ? (
        <div className="grid gap-4 md:grid-cols-2">
          {cityRequestsData.requests.map((requestData) => (
            <div key={requestData.request.id} className="mb-4">
              <RequestCard request={requestData.request} type="host">
                <Button
                  variant="secondary"
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
      ) : cityOffersData && offers ? (
        <div className="grid gap-4 md:grid-cols-2">
          {cityOffersData.requests.map((offerData) => (
            <div key={offerData.offer.id} className="mb-4">
              <PastOfferCard
                request={offerData.request}
                offer={offerData.offer}
                property={offerData.property}
              >
                <Button
                onClick={() => {
                  setOfferWithdrawalDialogOpen(true);
                  setSelectedOffer(offerData.offer.id);
                }}
                >
                  Withdraw
                </Button>
              </PastOfferCard>
            </div>
          ))}
        </div>
      ) : (
        // empty state
        <div className="flex flex-col items-center gap-y-3 rounded-lg border bg-white py-4">
          <h3 className="text-lg font-semibold">No requests found</h3>
          <p>
            Consider loosen requirements or allow for more ways to book to see
            more requests.
          </p>
          <Link href="/host/calendar">
            <Button
              className="border-black text-primaryGreen"
              variant="outline"
            >
              Change Restrictions
            </Button>
          </Link>
        </div>
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
      {selectedOffer && (
        <PastOfferWithdrawDialog
          offerId={selectedOffer}
          open={offerWithdrawalDialogOpen}
          onOpenChange={setOfferWithdrawalDialogOpen}
        />
      )}
    </div>
  );
}
