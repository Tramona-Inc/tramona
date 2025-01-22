import React, { useState } from "react";
import { type Conversation } from "@/utils/store/conversations";
import { format } from "date-fns";
import { api } from "@/utils/api";
import { formatCurrency } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import RequestToBookOrBookNowPriceCard from "../propertyPages/sidebars/priceCards/RequestToBookOrBookNowPriceCard";
import WithdrawRequestToBookDialog from "../requests-to-book/WithdrawRequestToBookDialog";
import { toast } from "../ui/use-toast";
import RequestCard, { HostDashboardRequest } from "../requests/RequestCard";
import { errorToast } from "@/utils/toasts";
import { useHostTeamStore } from "@/utils/store/hostTeamStore";
import { Property } from "@/server/db/schema";
import HostFinishRequestDialog from "../dashboard/host/requests/city/HostFinishRequestDialog";
import HostRequestDialog from "../dashboard/host/requests/city/HostRequestDialog";
import HostConfirmRequestDialog from "../dashboard/host/HostConfirmRequestDialog";
import HostRequestToBookDialog from "../dashboard/host/requests/requests-to-book/HostRequestToBookDialog";
import HostRequestToBookCard from "../dashboard/host/requests/requests-to-book/HostRequestToBookCard";
import ImageCarousel from "../_common/ImageCarousel";

interface SelectedConversationSidebarProps {
  conversation: Conversation;
  isHost: boolean;
}

const SelectedConversationSidebar: React.FC<
  SelectedConversationSidebarProps
> = ({ conversation, isHost }) => {
  const currentHostTeamId = useHostTeamStore(
    (state) => state.currentHostTeamId,
  );

  console.log(isHost, "isHost");
  const [step, setStep] = useState(0);
  const [selectedProperties, setSelectedProperties] = useState<number[]>([]);

  const [requestToBookDialogOpen, setRequestToBookDialogOpen] = useState(false);

  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [propertyPrices, setPropertyPrices] = useState<Record<number, string>>(
    {},
  );

  const { data: hostTeamMembers, isLoading: isLoadingHostTeamMembers } =
    api.hostTeams.getHostTeamMembers.useQuery(
      {
        hostTeamId: currentHostTeamId!,
      },
      {
        enabled: !!currentHostTeamId,
      },
    );
  const [selectedRequest, setSelectedRequest] =
    useState<HostDashboardRequest | null>(null);

  const [properties, setProperties] = useState<
    (Property & { taxAvailable: boolean })[] | null
  >(null);

  const participantIds = conversation.participants.map(
    (participant) => participant.id,
  );

  const userId =
    !isLoadingHostTeamMembers && hostTeamMembers
      ? participantIds.find(
          (participantId) =>
            !hostTeamMembers.some((member) => member.userId === participantId),
        )
      : undefined;

  // Ensure userId exists
  const userIdToUse = userId;

  const { mutateAsync: rejectRequestToBook } =
    api.stripe.rejectOrCaptureAndFinalizeRequestToBook.useMutation();

  const { mutateAsync: rejectRequest } =
    api.requests.rejectRequest.useMutation();

  const { data: currentRequestsToBookTraveler } =
    api.requestsToBook.getByPropertyId.useQuery(
      {
        propertyId: conversation.propertyId!,
        conversationParticipants: conversation.participants.map(
          (participant) => participant.id,
        ),
      },
      {
        enabled: !!conversation.propertyId && !isHost,
      },
    );
  const { data: currentRequestsToBookForHost, isLoading: isLoadingRequests } =
    api.requestsToBook.getByPropertyIdForHost.useQuery(
      {
        propertyId: conversation.propertyId!,
        conversationParticipants: conversation.participants.map(
          (participant) => participant.id,
        ),
        userId: userIdToUse, // Use the safely determined userId
      },
      {
        enabled: !!conversation.propertyId && !!userIdToUse && isHost, // Only run the query when userId is ready
      },
    );

  const { data: propertyInfo } = api.properties.getById.useQuery(
    {
      id: conversation.propertyId!,
    },
    {
      enabled:
        !!conversation.propertyId &&
        (!currentRequestsToBookTraveler ||
          currentRequestsToBookTraveler.length === 0) &&
        !isLoadingRequests, // Wait until currentRequestsToBook finishes loading
    },
  );

  const { data: requestHost } = api.requests.getByIdForHost.useQuery(
    {
      id: conversation.requestId!,
      hostTeamId: currentHostTeamId!,
    },
    {
      enabled: !!conversation.requestId && isHost,
    },
  );

  const { data: requestTraveler } = api.requests.getById.useQuery(
    {
      id: conversation.requestId!,
    },
    {
      enabled: !!conversation.requestId && !isHost,
    },
  );

  const request = isHost ? requestHost : requestTraveler;
  const bid = isHost
    ? currentRequestsToBookForHost?.[0]
    : currentRequestsToBookTraveler?.[0];
  const property = propertyInfo ?? bid?.property;

  // console.log(propertyInfo, "propertyInfo");

  // console.log(bid, "bid");

  // console.log(request, "request");

  return (
    <>
      {(bid ?? request) && !isHost && (
        <WithdrawRequestToBookDialog
          requestToBookId={(bid?.id ?? requestTraveler?.id)!}
          open={withdrawOpen}
          onOpenChange={setWithdrawOpen}
        />
      )}
      <div className="flex flex-col gap-6 rounded-lg bg-white p-6 shadow-md">
        {/* Header */}
        <div className="border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {property?.name ?? "Property Information"}
          </h2>
          {conversation.name && (
            <p className="mt-1 text-sm text-gray-500">
              Conversation ID: {conversation.id}
            </p>
          )}
        </div>

        {/* Property Section */}
        <div className="max-h-[500px] overflow-y-auto">
          {property && (
            <div className="rounded-lg border bg-gray-50 p-4">
              <ImageCarousel imageUrls={property.imageUrls} />
              {propertyInfo && !isHost && (
                <>
                  <RequestToBookOrBookNowPriceCard property={propertyInfo} />
                </>
              )}
              {isHost && bid && (
                <>
                  <HostRequestToBookCard
                    requestToBook={currentRequestsToBookForHost![0]!}
                  >
                    {bid.status === "Pending" && (
                      <Button
                        variant="secondary"
                        onClick={async () => {
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
                  {currentHostTeamId && isHost && bid && (
                    <HostRequestToBookDialog
                      open={requestToBookDialogOpen}
                      setOpen={setRequestToBookDialogOpen}
                      requestToBook={currentRequestsToBookForHost![0]!}
                      currentHostTeamId={currentHostTeamId}
                    />
                  )}
                </>
              )}
            </div>
          )}
          {/* ) : ( */}
          {/* <> */}
          {!isHost && (bid ?? request) && (
            <>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Check-in:</span>{" "}
                {bid?.checkIn.toLocaleDateString() ??
                  requestTraveler?.checkIn.toLocaleDateString() ??
                  "N/A"}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Check-out:</span>{" "}
                {bid?.checkOut.toLocaleDateString() ??
                  requestTraveler?.checkOut.toLocaleDateString() ??
                  "N/A"}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Amount:</span>{" "}
                {formatCurrency(
                  bid?.baseAmountBeforeFees ??
                    requestTraveler?.maxTotalPrice ??
                    0,
                )}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Guests:</span>{" "}
                {bid?.numGuests ?? requestTraveler?.numGuests ?? "N/A"}
              </p>
              {!isHost && (
                <div className="flex justify-end">
                  <Button onClick={() => setWithdrawOpen(true)}>
                    Withdraw
                  </Button>
                </div>
              )}
            </>
          )}
          {isHost && requestHost && (
            <RequestCard request={requestHost.request} type="host">
              <Button
                variant="secondary"
                onClick={async () => {
                  await rejectRequest({
                    requestId: requestHost.request.id,
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
                            "You do not have permission to create an offer.",
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
                  setDialogOpen(true);
                  setSelectedRequest(requestHost.request);
                  setProperties(requestHost.properties);
                }}
              >
                Make an offer
              </Button>
            </RequestCard>
          )}
          {/* </> */}
          {/* )} */}

          {/* Created Date Section */}
          <div className="rounded-lg border bg-gray-50 p-4">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Created At:</span>{" "}
              {format(new Date(conversation.createdAt), "MMMM dd, yyyy h:mm a")}
            </p>
          </div>
        </div>
      </div>
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
    </>
  );
};

export default SelectedConversationSidebar;
