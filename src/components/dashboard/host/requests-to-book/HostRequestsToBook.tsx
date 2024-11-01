import { SkeletonText } from "@/components/ui/skeleton";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import HostRequestToBookDialog from "./HostRequestToBookDialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { RequestsToBook, User, type Property } from "@/server/db/schema";
import HostConfirmRequestToBookDialog from "./HostConfirmRequestToBookDialog";
import HostFinishRequestToBookDialog from "./HostFinishRequestToBookDialog";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { errorToast } from "@/utils/toasts";
import RequestToBookCard from "@/components/requests-to-book/RequestToBookCard";

type RequestsToBookWithProperty = RequestsToBook & {
  property: Property & { taxAvailable: boolean };
  traveler: Pick<
    User,
    "firstName" | "lastName" | "name" | "image" | "location" | "about"
  >;
  madeByGroup: {
    ownerId: string;
    owner: {
      name: string | null;
      firstName: string | null;
      lastName: string | null;
      image: string | null;
      location: string | null;
      about: string | null;
    };
  };
};

type RequestsToBookResponse = {
  activeRequestsToBook: RequestsToBookWithProperty[];
  inactiveRequestsToBook: RequestsToBookWithProperty[];
};

export default function HostRequestsToBook() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const propertyId = parseInt(id as string);
  const [property, setProperty] = useState<Property & { taxAvailable: boolean } | null>(null);
  const [selectedRequest, setSelectedRequest] =
    useState<RequestsToBookWithProperty | null>(null);
  const [step, setStep] = useState(0);

  const [propertiesData, setPropertiesData] =
    useState<RequestsToBookResponse | null>(null);

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

  const { data } = api.requestsToBook.getHostRequestsToBookFromId.useQuery(
    { propertyId },
    {
      onSuccess: (
        fetchedPropertiesWithRequestsToBook: RequestsToBookResponse,
      ) => {
        setPropertiesData(fetchedPropertiesWithRequestsToBook);
      },
    },
  );

  const { mutateAsync: rejectRequestToBook } =
    api.requestsToBook.rejectRequestToBook.useMutation();

  return (
    <div className="p-4">
      <div className="mb-4 xl:hidden">
        <Link href="/host/requests">
          <ChevronLeft />
        </Link>
      </div>
      {propertiesData?.activeRequestsToBook ? (
        <div className="grid gap-4 md:grid-cols-2">
          {propertiesData.activeRequestsToBook.map((data) => (
            <div key={data.id} className="mb-4">
              <RequestToBookCard requestToBook={data} type="host">
                <Button
                  variant="secondary"
                  onClick={async () => {
                    await rejectRequestToBook({
                      id: data.id,
                    })
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
                    setSelectedRequest(data);
                    setProperty(data.property);
                  }}
                >
                  Respond
                </Button>
              </RequestToBookCard>
            </div>
          ))}
        </div>
      ) : (
        <SkeletonText>No requests found for this property</SkeletonText>
      )}
      {step === 0 && property && selectedRequest && (
        <HostRequestToBookDialog
          open={dialogOpen}
          setOpen={setDialogOpen}
          property={property}
          requestToBook={selectedRequest}
          setStep={setStep}
        />
      )}
      {step === 1 && property && selectedRequest && (
        <HostConfirmRequestToBookDialog
          requestToBook={selectedRequest}
          property={property}
          setStep={setStep}
          open={dialogOpen}
          setOpen={setDialogOpen}
        />
      )}
      {step === 2 && selectedRequest && (
        <HostFinishRequestToBookDialog
          requestToBook={selectedRequest}
          open={dialogOpen}
          setOpen={setDialogOpen}
        />
      )}
    </div>
  );
}
