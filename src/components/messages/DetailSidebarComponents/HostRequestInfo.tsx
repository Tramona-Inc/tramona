import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useHostTeamStore } from "@/utils/store/hostTeamStore";
import { api } from "@/utils/api";
import { toast } from "../../ui/use-toast";
import { errorToast } from "@/utils/toasts";
import RequestCard, { HostDashboardRequest } from "../../requests/RequestCard";
import { Property } from "@/server/db/schema";
import HostRequestDialog from "../../dashboard/host/requests/city/HostRequestDialog";
import { Request } from "@/server/db/schema";

interface HostRequestInfoProps {
  request: Request | undefined;
  properties: (Property & { taxAvailable: boolean })[] | null;
  setSelectedRequest: React.Dispatch<
    React.SetStateAction<HostDashboardRequest | null>
  >;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setProperties: React.Dispatch<
    React.SetStateAction<(Property & { taxAvailable: boolean })[] | null>
  >;
}

const HostRequestInfo: React.FC<HostRequestInfoProps> = ({
  request,
  properties,
  setSelectedRequest,
  setDialogOpen,
  setProperties,
}) => {
  const currentHostTeamId = useHostTeamStore(
    (state) => state.currentHostTeamId,
  );

  const { mutateAsync: rejectRequest } =
    api.requests.rejectRequest.useMutation();

  return (
    <>
      {request && (
        <RequestCard request={request} type="host">
          <Button
            variant="secondary"
            onClick={async () => {
              if (!request.id) return;
              await rejectRequest({
                requestId: request.id,
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
                      title: "You do not have permission to create an offer.",
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
          <Button
            onClick={() => {
              if (!request) return;
              setDialogOpen(true);
              setSelectedRequest(request);
              setProperties(properties);
            }}
          >
            Make an offer
          </Button>
        </RequestCard>
      )}
    </>
  );
};

export default HostRequestInfo;
