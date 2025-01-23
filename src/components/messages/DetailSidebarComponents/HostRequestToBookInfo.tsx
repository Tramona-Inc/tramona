import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useHostTeamStore } from "@/utils/store/hostTeamStore";
import { api } from "@/utils/api";
import { toast } from "../../ui/use-toast";
import { errorToast } from "@/utils/toasts";
import HostRequestToBookCard from "../../dashboard/host/requests/requests-to-book/HostRequestToBookCard";
import HostRequestToBookDialog from "../../dashboard/host/requests/requests-to-book/HostRequestToBookDialog";
import { RequestToBook } from "@/server/db/schema";

interface HostRequestToBookInfoProps {
  bid: RequestToBook | undefined;
}

const HostRequestToBookInfo: React.FC<HostRequestToBookInfoProps> = ({
  bid,
}) => {
  const currentHostTeamId = useHostTeamStore(
    (state) => state.currentHostTeamId,
  );

  const [requestToBookDialogOpen, setRequestToBookDialogOpen] = useState(false);
  const { mutateAsync: rejectRequestToBook } =
    api.stripe.rejectOrCaptureAndFinalizeRequestToBook.useMutation();

  return (
    <>
      {bid && (
        <HostRequestToBookCard requestToBook={bid}>
          {bid.status === "Pending" && (
            <Button
              variant="secondary"
              onClick={async () => {
                if (!bid.id) return;
                await rejectRequestToBook({
                  isAccepted: false,
                  requestToBookId: bid.id,
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
          {bid.status === "Pending" ? (
            <Button
              onClick={() => {
                setRequestToBookDialogOpen(true);
              }}
            >
              Respond
            </Button>
          ) : (
            <Button disabled>{bid.status}</Button>
          )}
        </HostRequestToBookCard>
      )}
      {currentHostTeamId && bid && (
        <HostRequestToBookDialog
          open={requestToBookDialogOpen}
          setOpen={setRequestToBookDialogOpen}
          requestToBook={bid}
          currentHostTeamId={currentHostTeamId}
        />
      )}
    </>
  );
};

export default HostRequestToBookInfo;
