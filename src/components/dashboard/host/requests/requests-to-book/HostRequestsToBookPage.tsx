import { api } from "@/utils/api";
import { useSearchParams } from "next/navigation";
import HostRequestToBookDialog from "./HostRequestToBookDialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { errorToast } from "@/utils/toasts";
import { Home } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import HostRequestToBookCard from "./HostRequestToBookCard";
import { useChatWithUser } from "@/utils/messaging/useChatWithUser";
import { useHostTeamStore } from "@/utils/store/hostTeamStore";
import useSetInitialHostTeamId from "@/components/_common/CustomHooks/useSetInitialHostTeamId";
import { useEffect } from "react";

export default function HostRequestsToBookPage() {
  useSetInitialHostTeamId();
  const { currentHostTeamId } = useHostTeamStore();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const searchParams = useSearchParams();

  // Use useSearchParams to get the propertyId from the query string
  const propertyId = parseInt(searchParams.get("propertyId") ?? "0");

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
      { propertyId, currentHostTeamId: currentHostTeamId! },
      { enabled: !!currentHostTeamId },
    );

  const { mutateAsync: rejectRequestToBook } =
    api.stripe.rejectOrCaptureAndFinalizeRequestToBook.useMutation();

  const chatWithUser = useChatWithUser();

  useEffect(() => {
    if (!currentHostTeamId) {
      return;
    }
  }, [currentHostTeamId]);

  return (
    <div>
      <div className="mb-4 xl:hidden">
        <Link href="/host/requests">
          <ChevronLeft />
        </Link>
      </div>
      {propertyRequests?.activeRequestsToBook ? (
        <div className="grid gap-4 md:grid-cols-2">
          {propertyRequests.activeRequestsToBook.map((data) => (
            <div key={data.id} className="mb-4">
              <HostRequestToBookCard requestToBook={data}>
                <Button
                  variant="secondary"
                  onClick={() => {
                    void chatWithUser(data.userId, propertyId);
                  }}
                >
                  Message User
                </Button>
                {data.status === "Pending" && (
                  <Button
                    variant="secondary"
                    onClick={async () => {
                      await rejectRequestToBook({
                        isAccepted: false,
                        requestToBookId: data.id,
                        currentHostTeamId: currentHostTeamId!,
                      })
                        .then(() => {
                          toast({
                            title: "Successfully rejected request",
                          });
                        })
                        .catch((error) => {
                          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                          if (error.data?.code === "FORBIDDEN") {
                            toast({
                              title:
                                "You do not have permission to respond to a booking.",
                              description:
                                "Please contact your team owner to request access.",
                            });
                          } else {
                            errorToast();
                          }
                        });
                    }}
                  >
                    Reject
                  </Button>
                )}
                {data.status === "Pending" ? (
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
              </HostRequestToBookCard>
              {currentHostTeamId && (
                <HostRequestToBookDialog
                  open={dialogOpen}
                  setOpen={setDialogOpen}
                  requestToBook={data}
                  currentHostTeamId={currentHostTeamId}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <Card className="flex h-full items-center justify-center">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Home className="mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              No property selected
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
