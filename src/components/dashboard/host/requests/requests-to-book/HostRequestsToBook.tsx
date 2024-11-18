import { api } from "@/utils/api";
import { useRouter } from "next/router";
import HostRequestToBookDialog from "./HostRequestToBookDialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { errorToast } from "@/utils/toasts";
import RequestToBookCard from "@/components/requests-to-book/RequestToBookCard";
import { Home } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { RequestToBookCardPreviews } from "../../../../requests-to-book/RequestToBookCardPreviews";

export default function HostRequestsToBook() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const propertyId = parseInt(router.query.propertyId as string) || 0; // Default to 0 if parsing fails
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

  const { data: propertyRequests } =
    api.requestsToBook.getHostRequestsToBookFromId.useQuery(
      { propertyId },
      { enabled: !!router.isReady },
    );
  console.log(propertyRequests);

  const { mutateAsync: rejectRequestToBook } =
    api.stripe.rejectOrCaptureAndFinalizeRequestToBook.useMutation();

  return (
    <div className="p-4">
      <div className="mb-4 xl:hidden">
        <Link href="/host/requests">
          <ChevronLeft />
        </Link>
      </div>
      {propertyRequests?.activeRequestsToBook ? (
        <div className="grid gap-4 md:grid-cols-2">
          {propertyRequests.activeRequestsToBook.map((data) => (
            <div key={data.id} className="mb-4">
              <RequestToBookCard requestToBook={data} type="host">
                {data.status === "Pending" && (
                  <Button
                    variant="secondary"
                    onClick={async () => {
                      await rejectRequestToBook({
                        isAccepted: false,
                        requestToBookId: data.id,
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
                )}
                {data.status !== "Pending" ? (
                  <Button
                    onClick={() => {
                      setDialogOpen(true);
                    }}
                  >
                    Respond
                  </Button>
                ) : (
                  <Button disabled>{data.status}</Button>
                )}
              </RequestToBookCard>
              <HostRequestToBookDialog
                open={dialogOpen}
                setOpen={setDialogOpen}
                requestToBook={data}
              />
            </div>
          ))}
        </div>
      ) : (
        <Card className="flex h-full items-center justify-center">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Home className="mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              No Property Selected
            </h3>
            <p className="max-w-sm text-sm text-gray-500">
              Please select a property from the list to view its requests and
              details.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
