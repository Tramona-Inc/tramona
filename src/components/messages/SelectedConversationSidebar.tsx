import React, { useState } from "react";
import { type Conversation } from "@/utils/store/conversations";
import { format } from "date-fns";
import { api } from "@/utils/api";
import { formatCurrency } from "@/utils/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [selectedProperties, setSelectedProperties] = useState<number[]>([]);

  const [requestToBookDialogOpen, setRequestToBookDialogOpen] = useState(false);

  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [propertyPrices, setPropertyPrices] = useState<Record<number, string>>(
    {},
  );

  const { data: hostTeamMembers, isLoading: isLoadingHostTeamMembers } =
    api.hostTeams.getHostTeamMembers.useQuery({
      hostTeamId: currentHostTeamId!,
    }, {
      enabled: !!currentHostTeamId,
    });
    const [selectedRequest, setSelectedRequest] =
      useState<HostDashboardRequest | null>(null);

    const [properties, setProperties] = useState<
      (Property & { taxAvailable: boolean })[] | null
    >(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const participantIds = conversation.participants.map(
    (participant) => participant.id,
  );

  const userId = !isLoadingHostTeamMembers && hostTeamMembers
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

    const {data: currentRequestsToBookTraveler} =
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
        (!currentRequestsToBookTraveler || currentRequestsToBookTraveler.length === 0) &&
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
  const bid = isHost ? currentRequestsToBookForHost?.[0] : currentRequestsToBookTraveler?.[0];
  const property = propertyInfo ?? bid?.property;

  console.log(propertyInfo, "propertyInfo");

  console.log(bid, "bid");

  console.log(request, "request");

  console.log(withdrawOpen, "withdrawOpen");

  const nextImage = (e: React.MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    if (currentImageIndex < (property?.imageUrls.length ?? 0) - 1) {
      setCurrentImageIndex((prevIndex) => prevIndex + 1);
    }
  };

  const prevImage = (e: React.MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prevIndex) => prevIndex - 1);
    }
  };

  return (
    <>
      {(bid || request) && (
        <WithdrawRequestToBookDialog
          requestToBookId={bid?.id }
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
              <div className="relative mb-3 h-48 w-full overflow-hidden rounded-md bg-gray-200">
                <div
                  className="flex h-full transition-transform duration-300 ease-in-out"
                  style={{
                    transform: `translateX(-${currentImageIndex * 100}%)`,
                  }}
                >
                  {property.imageUrls.map((imageUrl, index) => (
                    <div
                      key={index}
                      className="relative h-full w-full flex-shrink-0"
                    >
                      <Image
                        src={imageUrl}
                        alt={`Property image ${index + 1}`}
                        fill
                        onError={(e) => {
                          console.error(
                            `Error loading image for property with url ${imageUrl}:`,
                            e,
                          );
                          (e.target as HTMLImageElement).src =
                            "/placeholder.jpg";
                        }}
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                {currentImageIndex > 0 && (
                  <Button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white bg-opacity-50 p-2 hover:bg-opacity-80"
                  >
                    <ChevronLeft size={24} className="text-gray-800" />
                  </Button>
                )}
                {currentImageIndex < (property.imageUrls.length || 0) - 1 && (
                  <Button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white bg-opacity-50 p-2 hover:bg-opacity-80"
                  >
                    <ChevronRight size={24} className="text-gray-800" />
                  </Button>
                )}
              </div>
              {propertyInfo && !isHost && (
                <>
                  <RequestToBookOrBookNowPriceCard property={propertyInfo} />
                </>
              )}
              {isHost && bid && (
                <>
                  <HostRequestToBookCard requestToBook={bid}>
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
                      requestToBook={bid}
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
                      request.checkIn.toLocaleDateString() ??
                      "N/A"}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Check-out:</span>{" "}
                    {bid?.checkOut.toLocaleDateString() ??
                      request.checkOut.toLocaleDateString() ??
                      "N/A"}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Amount:</span>{" "}
                    {formatCurrency(
                      bid?.baseAmountBeforeFees ??
                        request.maxTotalPrice ??
                        0,
                    )}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Guests:</span>{" "}
                    {bid?.numGuests ?? request.numGuests ?? "N/A"}
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
              {isHost && request && (
                <RequestCard request={request.request} type="host">
                  <Button
                    variant="secondary"
                    onClick={async () => {
                      await rejectRequest({
                        requestId: request.request.id,
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
                      setSelectedRequest(request.request);
                      setProperties(request.properties);
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
