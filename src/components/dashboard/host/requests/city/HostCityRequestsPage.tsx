import { api } from "@/utils/api";
import { useRouter } from "next/router";
import HostRequestDialog from "./HostRequestDialog";
import { type HostDashboardRequest } from "@/components/requests/RequestCard";
import { useState } from "react";
import { type Property } from "@/server/db/schema";
import HostConfirmRequestDialog from "../../HostConfirmRequestDialog";
import HostFinishRequestDialog from "./HostFinishRequestDialog";
import { useToast } from "@/components/ui/use-toast";
import PastOfferWithdrawDialog from "./PastOfferWithdrawDialog";
import CityRequestSection from "./CityRequestSection";
import OffersSentSection from "./OffersSentSection";
import NoRequestEmptyState from "../NoRequestEmptyState";
import { useRequests } from "../RequestsContext";
import OnlyOtherRequestEmptyState from "../OnlyOtherRequestsEmptyState";
export default function HostCityRequestsPage() {
  const { toast } = useToast();
  const [propertyPrices, setPropertyPrices] = useState<Record<number, string>>(
    {},
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const { city, option } = router.query;

  const [selectedRequest, setSelectedRequest] =
    useState<HostDashboardRequest | null>(null);
  const [properties, setProperties] = useState<
    (Property & { taxAvailable: boolean })[] | null
  >(null);
  const [step, setStep] = useState(0);

  const [selectedOffer, setSelectedOffer] = useState<number | null>(null);

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

  const { separatedData, isLoading: isRequestsLoading } = useRequests();

  const { normal, other } = separatedData ?? { normal: [], other: [] };
  const noNormalRequests = normal.length === 0;
  const completelyEmpty = noNormalRequests && other.length === 0;

  return (
    <div>
      {option === "normal" ? (
        <CityRequestSection
          setDialogOpen={setDialogOpen}
          setSelectedRequest={setSelectedRequest}
          setProperties={setProperties}
          separatedData={separatedData}
          isRequestsLoading={isRequestsLoading}
        />
      ) : option === "sent" ? (
        <OffersSentSection
          setOfferWithdrawalDialogOpen={setOfferWithdrawalDialogOpen}
          setSelectedOffer={setSelectedOffer}
          city={city}
        />
      ) : option === "other" ? (
        <CityRequestSection
          setDialogOpen={setDialogOpen}
          setSelectedRequest={setSelectedRequest}
          setProperties={setProperties}
          separatedData={separatedData}
          isRequestsLoading={isRequestsLoading}
        />
      ) : completelyEmpty ? (
        <NoRequestEmptyState />
      ) : other[0]?.city ? (
        <OnlyOtherRequestEmptyState firstCity={other[0].city} />
      ) : (
        <NoRequestEmptyState />
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
          setStep={setStep}
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
